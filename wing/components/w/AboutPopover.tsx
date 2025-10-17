
import { useState, useRef, useEffect } from 'react';
import { SquareMinus, SquarePlus } from 'lucide-react';

function AboutPopover({ aboutText }: { aboutText?: string }) {
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPopover(false);
      }
    };

    if (showPopover) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopover]);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button onClick={() => setShowPopover(prev => !prev)}>
        {
          showPopover ? <SquareMinus className='text-zinc-500 w-5 h-5' /> :
            <SquarePlus className="text-zinc-500 w-5 h-5" />

        }
      </button>

      {showPopover && (
        <div className="absolute z-50 mt-2 w-64 rounded-md bg-zinc-800 text-white text-sm shadow-lg p-3">
          {aboutText || "No about info available."}
        </div>
      )}
    </div>
  );
}

export default AboutPopover;
