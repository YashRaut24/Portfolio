import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import {
  isSoundEnabled,
  setSoundEnabled,
} from '../../utils/sound';
import './SoundToggle.css';

function SoundToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(isSoundEnabled());
  }, []);

  const toggleSound = () => {
    const next = !enabled;
    setEnabled(next);
    setSoundEnabled(next);
  };

  return (
    <button
      className="sound-toggle"
      onClick={toggleSound}
      aria-label={enabled ? 'Mute sounds' : 'Enable sounds'}
      title={enabled ? 'Mute sounds' : 'Enable sounds'}
    >
      {enabled ? (
        <Volume2 size={20} />
      ) : (
        <VolumeX size={20} />
      )}
    </button>
  );
}

export default SoundToggle;