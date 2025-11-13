import React from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface TermsOfUseScreenProps {
    onClose: () => void;
}

const PolicySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
        <div className="text-slate-600 space-y-3 text-sm">{children}</div>
    </div>
);

export const TermsOfUseScreen: React.FC<TermsOfUseScreenProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-40 bg-slate-100 flex flex-col animate-slide-in-right">
            <header className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-20">
                <button onClick={onClose} className="p-2 -ml-2 mr-2">
                    <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-800">Termos de Uso</h1>
            </header>

            <main className="flex-grow overflow-y-auto p-6">
                <p className="text-xs text-slate-500 mb-6">Última atualização: 24 de Julho de 2024</p>

                <PolicySection title="1. Aceitação dos Termos">
                    <p>
                        Ao criar uma conta e usar o aplicativo PURPOSE MATCH ("Serviço"), você concorda em se vincular a estes Termos de Uso, à nossa Política de Privacidade, Política de Cookies e Regras da Comunidade. Se você não aceita e não concorda em se vincular a todos os termos, não use o Serviço.
                    </p>
                </PolicySection>

                <PolicySection title="2. Elegibilidade">
                    <p>
                        Você deve ter pelo menos 18 anos de idade para criar uma conta no PURPOSE MATCH e usar o Serviço. Ao criar uma conta, você declara e garante que tem o direito, a autoridade e a capacidade de celebrar este acordo e de cumprir todos os seus termos e condições.
                    </p>
                </PolicySection>

                <PolicySection title="3. Sua Conta">
                    <p>
                        Você é responsável por manter a confidencialidade de suas credenciais de login. Você é o único responsável por todas as atividades que ocorrem em sua conta. Se você acredita que alguém obteve acesso não autorizado à sua conta, por favor, notifique-nos imediatamente.
                    </p>
                </PolicySection>

                <PolicySection title="4. Conduta do Usuário e Conteúdo">
                    <p>
                        Você concorda em usar o Serviço de maneira consistente com todas e quaisquer leis e regulamentos aplicáveis. Você concorda em não postar nenhum conteúdo que:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li>Seja odioso, ameaçador, sexualmente explícito ou pornográfico;</li>
                        <li>Incita à violência ou contenha nudez ou violência gráfica ou gratuita;</li>
                        <li>Promova qualquer atividade ilegal ou infrinja os direitos de qualquer outra pessoa;</li>
                        <li>Seja enganoso, fraudulento ou represente falsamente sua afiliação com qualquer pessoa ou entidade.</li>
                    </ul>
                    <p>Nós nos reservamos o direito de remover qualquer conteúdo que viole estas regras e de encerrar a conta do infrator.</p>
                </PolicySection>
                
                <PolicySection title="5. Segurança">
                    <p>A segurança da nossa comunidade é primordial. Você concorda em seguir nossas Dicas de Segurança e Regras da Comunidade. O PURPOSE MATCH não é responsável pela conduta de qualquer usuário dentro ou fora do Serviço. Você concorda em ter cautela em todas as interações com outros usuários.</p>
                </PolicySection>

                <PolicySection title="6. Compras">
                    <p>
                        Oferecemos produtos e serviços para compra ("compras no aplicativo"). Se você optar por fazer uma compra no aplicativo, será solicitado que você confirme sua compra com o provedor de pagamento aplicável, e seu método de pagamento será cobrado pelos valores exibidos. Todas as compras não são reembolsáveis.
                    </p>
                </PolicySection>

                <PolicySection title="7. Encerramento da Conta">
                    <p>
                        Você pode encerrar sua conta a qualquer momento, indo para a tela de "Ajustes" e seguindo as instruções para cancelamento. Nós podemos encerrar ou suspender sua conta a qualquer momento sem aviso prévio se acreditarmos que você violou este Acordo.
                    </p>
                </PolicySection>

                <PolicySection title="8. Isenção de Garantias e Limitação de Responsabilidade">
                     <p>O PURPOSE MATCH fornece o serviço "como está" e "conforme disponível". Não garantimos que o serviço será ininterrupto, seguro ou livre de erros. Na medida máxima permitida pela lei aplicável, em nenhum caso o PURPOSE MATCH será responsável por quaisquer danos indiretos, consequenciais, exemplares, incidentais, especiais ou punitivos.</p>
                </PolicySection>
            </main>
        </div>
    );
};