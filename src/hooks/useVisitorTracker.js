import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function useVisitorTracker() {
  const sessionIdRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    let active = true;
    let intervalId = null;

    const runTracker = async () => {
      if (!supabase) {
        console.warn('Supabase client is not configured. Skipping visitor tracking.');
        return;
      }
      
      // 1. Gather device info
      const ua = navigator.userAgent;
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
      
      // Browser detection
      let browserName = "Outro";
      if (ua.includes("Chrome") && !ua.includes("Chromium") && !ua.includes("Edg")) {
        browserName = "Google Chrome";
      } else if (ua.includes("Safari") && !ua.includes("Chrome") && !ua.includes("Chromium")) {
        browserName = "Safari";
      } else if (ua.includes("Firefox")) {
        browserName = "Mozilla Firefox";
      } else if (ua.includes("Edg")) {
        browserName = "Microsoft Edge";
      }

      // Phone spec / OS details
      let phoneSpec = "Desktop / Laptop";
      if (ua.includes("iPhone")) {
        const match = ua.match(/iPhone OS (\d+_\d+)/);
        phoneSpec = `iPhone (iOS ${match ? match[1].replace('_', '.') : ''})`;
      } else if (ua.includes("iPad")) {
        phoneSpec = "iPad";
      } else if (ua.includes("Android")) {
        const match = ua.match(/Android \d+;\s*([^;)]+)/);
        phoneSpec = match ? match[1].trim() : "Android Device";
      }

      // 2. Fetch IP-based Location (free ipapi.co fallback)
      let locationStr = "Desconhecido";
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const geo = await res.json();
          if (geo.city && geo.country_name) {
            locationStr = `${geo.city}, ${geo.country_name}`;
          } else if (geo.country_name) {
            locationStr = geo.country_name;
          }
        }
      } catch (e) {
        console.warn('IP location fetch failed, using fallback:', e.message);
      }

      if (!active) return;

      // 3. Insert initial session record into Supabase
      try {
        const { data, error } = await supabase
          .from('visitors')
          .insert([{
            mobile: isMobile,
            location: locationStr,
            browser: browserName,
            phone_spec: phoneSpec,
            session_time: 0
          }])
          .select();

        if (error) {
          console.error('Failed to log visitor session:', error.message);
        } else if (data && data[0]) {
          sessionIdRef.current = data[0].id;
          
          // 4. Start periodic duration update (every 10s)
          intervalId = setInterval(async () => {
            const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
            await supabase
              .from('visitors')
              .update({ session_time: elapsed })
              .eq('id', sessionIdRef.current);
          }, 10000);
        }
      } catch (e) {
        console.error('Supabase insert execution error:', e);
      }
    };

    runTracker();

    // Cleanup and final save on page leave / unmount
    return () => {
      active = false;
      if (intervalId) clearInterval(intervalId);
      
      if (supabase && sessionIdRef.current) {
        const finalElapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
        
        // Final update using standard promise in fire-and-forget style
        supabase
          .from('visitors')
          .update({ session_time: finalElapsed })
          .eq('id', sessionIdRef.current)
          .then(({ error }) => {
            if (error) console.error('Failed final session time update:', error.message);
          });
      }
    };
  }, []);
}
