import React from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface CookiePolicyScreenProps {
    onClose: () => void;
}

const PolicySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
        <div className="text-slate-600 space-y-3 text-sm">{children}</div>
    </div>
);

export const CookiePolicyScreen: React.FC<CookiePolicyScreenProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-40 bg-slate-100 flex flex-col animate-slide-in-right">
            <header className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-20">
                <button onClick={onClose} className="p-2 -ml-2 mr-2">
                    <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-800">Política de Cookies</h1>
            </header>

            <main className="flex-grow overflow-y-auto p-6">
                <p className="text-xs text-slate-500 mb-6">Última atualização: 24 de Julho de 2024</p>

                <PolicySection title="O que são Cookies?">
                    <p>
                        Cookies são pequenos arquivos de texto que são armazenados em seu dispositivo (computador, smartphone, tablet) quando você visita certos sites e aplicativos. Eles são amplamente utilizados para fazer os serviços funcionarem, ou funcionarem de forma mais eficiente, bem como para fornecer informações aos proprietários do serviço.
                    </p>
                    <p>
                        Nesta política, o termo "cookies" também se refere a tecnologias de rastreamento semelhantes, como pixels, web beacons e armazenamento local do navegador.
                    </p>
                </PolicySection>

                <PolicySection title="Como Usamos os Cookies">
                    <p>
                        Usamos cookies para aprimorar sua experiência no PURPOSE MATCH. Eles nos ajudam a entender como nosso aplicativo é usado, permitindo-nos melhorar a funcionalidade e a segurança. Aqui estão as principais categorias de cookies que usamos:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li>
                            <strong>Cookies Essenciais:</strong> Absolutamente necessários para o funcionamento do aplicativo. Eles permitem que você faça login, navegue e use recursos básicos. Sem eles, nossos serviços não funcionariam corretamente.
                        </li>
                        <li>
                            <strong>Cookies de Desempenho e Análise:</strong> Coletam informações sobre como os usuários interagem com nosso aplicativo, como quais recursos são mais populares e se encontram erros. Esses dados nos ajudam a otimizar o desempenho. Usamos provedores como o Google Analytics para isso.
                        </li>
                        <li>
                            <strong>Cookies de Funcionalidade:</strong> Permitem que o aplicativo se lembre das escolhas que você faz (como suas preferências de filtro ou idioma) para fornecer uma experiência mais personalizada.
                        </li>
                         <li>
                            <strong>Cookies de Publicidade:</strong> Podemos usar esses cookies para exibir anúncios que sejam mais relevantes para você e seus interesses, tanto dentro quanto fora do nosso aplicativo. Eles também ajudam a medir a eficácia das campanhas publicitárias.
                        </li>
                    </ul>
                </PolicySection>

                 <PolicySection title="Cookies de Terceiros">
                    <p>
                        Além de nossos próprios cookies, também podemos usar vários cookies de terceiros para relatar estatísticas de uso do serviço, fornecer funcionalidades essenciais, e assim por diante. Alguns de nossos parceiros incluem:
                    </p>
                     <ul className="list-disc list-inside space-y-2 pl-2">
                        <li>
                            <strong>Supabase:</strong> Nosso provedor de backend usa cookies para gerenciar sua sessão de autenticação de forma segura (por exemplo, para mantê-lo conectado).
                        </li>
                        <li>
                            <strong>Google:</strong> Usamos serviços do Google para análise de dados (Google Analytics) e, potencialmente, para servir pagamentos (Google Play) e anúncios.
                        </li>
                    </ul>
                </PolicySection>
                
                <PolicySection title="Suas Escolhas e Como Gerenciar Cookies">
                     <p>
                        Você tem o direito de decidir se aceita ou rejeita cookies. A maioria dos navegadores e dispositivos móveis permite que você controle os cookies através de suas configurações.
                    </p>
                    <p>
                        Por favor, note que se você optar por desativar os cookies, especialmente os essenciais, sua capacidade de usar nossos serviços pode ser limitada e algumas funcionalidades podem não operar como esperado.
                    </p>
                </PolicySection>
                
                <PolicySection title="Atualizações a esta Política">
                    <p>
                        Podemos atualizar nossa Política de Cookies de tempos em tempos para refletir, por exemplo, mudanças nos cookies que usamos ou por outras razões operacionais, legais ou regulatórias. Por favor, revisite esta política regularmente para se manter informado sobre nosso uso de cookies e tecnologias relacionadas.
                    </p>
                </PolicySection>

                <PolicySection title="Entre em Contato">
                    <p>
                        Se você tiver alguma dúvida sobre nosso uso de cookies, entre em contato conosco através da seção "Ajuda & Suporte" do aplicativo.
                    </p>
                </PolicySection>
            </main>
        </div>
    );
};