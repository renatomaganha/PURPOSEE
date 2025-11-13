import React, { useState, useEffect } from 'react';
import { AppLogo } from './icons/AppLogo';

interface DynamicLogoProps {
  logoUrl: string | null;
  className?: string;
  alt?: string;
}

export const DynamicLogo: React.FC<DynamicLogoProps> = ({ logoUrl, className, alt = 'PURPOSE MATCH Logo' }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Redefine o estado de erro sempre que a propriedade logoUrl mudar.
    // Isso permite tentar novamente se a URL for atualizada.
    setHasError(false);
  }, [logoUrl]);

  const handleError = () => {
    console.error(
      `Falha ao carregar o logotipo personalizado de: ${logoUrl}. ` +
      `Verifique se a URL está correta e se o bucket 'branding-assets' no Supabase está configurado como público.`
    );
    setHasError(true);
  };

  // Se tivermos uma logoUrl e não houver erro ao carregá-la, tente renderizá-la.
  if (logoUrl && !hasError) {
    return (
      <img
        src={logoUrl}
        alt={alt}
        className={className}
        onError={handleError}
      />
    );
  }

  // Caso contrário, renderize o logotipo padrão de fallback.
  return <AppLogo className={className} />;
};
