import React from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface PrivacyPolicyScreenProps {
    onClose: () => void;
}

const PolicySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
        <div className="text-slate-600 space-y-3 text-sm">{children}</div>
    </div>
);

export const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-40 bg-slate-100 flex flex-col animate-slide-in-right">
            <header className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-20">
                <button onClick={onClose} className="p-2 -ml-2 mr-2">
                    <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-800">Política de Privacidade</h1>
            </header>

            <main className="flex-grow overflow-y-auto p-6">
                <p className="text-xs text-slate-500 mb-6">Última atualização: 24 de Julho de 2024</p>

                <PolicySection title="Introdução">
                    <p>
                        Bem-vindo(a) ao PURPOSE MATCH. Sua privacidade é de extrema importância para nós. Esta Política de Privacidade explica como coletamos, usamos, compartilhamos e protegemos suas informações quando você utiliza nosso aplicativo. Ao usar o PURPOSE MATCH, você concorda com a coleta e uso de informações de acordo com esta política.
                    </p>
                </PolicySection>

                <PolicySection title="Informações que Coletamos">
                    <div>
                        <h3 className="font-bold text-slate-700 mb-1">A. Informações que Você nos Fornece:</h3>
                        <ul className="list-disc list-inside space-y-2 pl-2">
                            <li><strong>Dados de Criação de Perfil:</strong> Quando você cria uma conta, coletamos informações como seu nome, idade, gênero, fotos, biografia, localização, denominação, interesses e outros detalhes que você escolhe adicionar.</li>
                            <li><strong>Comunicações:</strong> Coletamos as mensagens que você envia e recebe de outros usuários dentro do aplicativo, bem como suas comunicações com nossa equipe de suporte.</li>
                            <li><strong>Verificação de Perfil:</strong> Se você optar por verificar seu perfil, podemos coletar uma selfie para fins de verificação de identidade.</li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-bold text-slate-700 mb-1 mt-3">B. Informações Coletadas Automaticamente:</h3>
                        <ul className="list-disc list-inside space-y-2 pl-2">
                            <li><strong>Dados de Uso:</strong> Informações sobre sua atividade no aplicativo, como a data e hora em que você fez login, os recursos que usou, os perfis que visualizou e suas interações com outros usuários (curtidas, matches).</li>
                            <li><strong>Dados do Dispositivo:</strong> Coletamos informações sobre o dispositivo que você usa para acessar nosso serviço, incluindo o modelo, sistema operacional, identificadores únicos e informações da rede móvel.</li>
                        </ul>
                    </div>
                </PolicySection>
                
                 <PolicySection title="Como Usamos Suas Informações">
                    <p>Usamos as informações que coletamos para:</p>
                     <ul className="list-disc list-inside space-y-2 pl-2">
                        <li>Criar e gerenciar sua conta e perfil.</li>
                        <li>Conectá-lo(a) com outros usuários.</li>
                        <li>Proporcionar uma experiência personalizada.</li>
                        <li>Garantir a segurança da nossa comunidade, monitorando atividades suspeitas ou violações dos nossos termos.</li>
                        <li>Melhorar nossos serviços e desenvolver novos recursos.</li>
                        <li>Comunicar-nos com você sobre o serviço, incluindo atualizações e ofertas.</li>
                    </ul>
                </PolicySection>

                <PolicySection title="Como Compartilhamos Suas Informações">
                    <p>Suas informações são compartilhadas nas seguintes circunstâncias:</p>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li><strong>Com Outros Usuários:</strong> Seu perfil é visível para outros usuários da plataforma. Quando você tem um "match" com alguém, vocês podem trocar mensagens.</li>
                        <li><strong>Com Provedores de Serviço:</strong> Usamos parceiros terceirizados para nos ajudar a operar e melhorar nossos serviços (ex: Supabase para backend e armazenamento de dados). Esses parceiros têm acesso às suas informações apenas para realizar tarefas em nosso nome e são obrigados a não divulgá-las ou usá-las para qualquer outra finalidade.</li>
                        <li><strong>Por Razões Legais:</strong> Podemos divulgar suas informações se for exigido por lei, ou se acreditarmos de boa fé que tal ação é necessária para cumprir com um processo legal, proteger a segurança de nossos usuários ou defender nossos direitos legais.</li>
                    </ul>
                </PolicySection>

                <PolicySection title="Seus Direitos e Escolhas">
                    <p>Você tem controle sobre suas informações. Dependendo de onde você mora, você pode ter os seguintes direitos:</p>
                     <div className="mt-3 bg-white p-3 rounded-md">
                        <h4 className="font-bold text-slate-700">Para Usuários no Brasil (LGPD):</h4>
                        <p>Você tem direito de acesso, confirmação da existência de tratamento, correção, anonimização, bloqueio ou eliminação de dados desnecessários, portabilidade e informação sobre o compartilhamento de dados.</p>
                    </div>
                     <div className="mt-3 bg-white p-3 rounded-md">
                        <h4 className="font-bold text-slate-700">Para Usuários no Espaço Econômico Europeu (GDPR):</h4>
                        <p>Você tem o direito de acessar, retificar, apagar, restringir o processamento, se opor ao processamento e o direito à portabilidade dos seus dados.</p>
                    </div>
                     <div className="mt-3 bg-white p-3 rounded-md">
                        <h4 className="font-bold text-slate-700">Para Usuários na Califórnia (CCPA):</h4>
                        <p>Você tem o direito de saber quais informações pessoais são coletadas, usadas e compartilhadas, e o direito de solicitar a exclusão de suas informações pessoais.</p>
                    </div>
                    <p className="mt-3">Para exercer qualquer um desses direitos, entre em contato conosco através da seção "Ajuda & Suporte".</p>
                </PolicySection>

                 <PolicySection title="Segurança e Retenção de Dados">
                    <p>
                        Tomamos medidas de segurança razoáveis para proteger suas informações contra acesso não autorizado ou destruição. Mantemos suas informações pessoais pelo tempo necessário para fornecer o serviço a você e para cumprir nossas obrigações legais.
                    </p>
                </PolicySection>

                <PolicySection title="Privacidade Infantil">
                    <p>Nossos serviços são destinados a usuários com 18 anos ou mais. Não coletamos intencionalmente informações pessoais de crianças menores de 18 anos.</p>
                </PolicySection>

                 <PolicySection title="Atualizações a esta Política">
                    <p>Podemos atualizar esta Política de Privacidade de tempos em tempos. Notificaremos você sobre quaisquer alterações publicando a nova política nesta página.</p>
                </PolicySection>
                
                <PolicySection title="Como Entrar em Contato Conosco">
                    <p>
                        Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco através da seção "Ajuda & Suporte" do aplicativo.
                    </p>
                </PolicySection>

            </main>
        </div>
    );
};