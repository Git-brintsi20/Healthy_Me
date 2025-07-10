'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface BackButtonProps {
  label?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back',
  variant = 'outline',
  size = 'sm',
  className = '',
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [translatedLabel, setTranslatedLabel] = useState(label);

  // Simulate fetching translated label based on user preferences
  useEffect(() => {
    if (user) {
      // Placeholder for translation logic (e.g., fetch from API based on user's language)
      // For now, we keep the default label or could map to a predefined translation
      const userLanguage = user.language || 'en'; // Assume user.language from auth
      const translations: Record<string, string> = {
        en: 'Back',
        hi: 'वापस', // Hindi
        es: 'Atrás', // Spanish
        // Add more translations as needed for farmers' languages
      };
      setTranslatedLabel(translations[userLanguage] || label);
    }
  }, [user, label]);

  const handleBack = () => {
    router.back();
  };

  return (
    <Button
      onClick={handleBack}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
      aria-label={translatedLabel}
    >
      <ArrowLeft className="w-5 h-5" />
      {translatedLabel}
    </Button>
  );
};

export default BackButton;