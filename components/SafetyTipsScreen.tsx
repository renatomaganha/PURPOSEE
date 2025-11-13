import React from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface SafetyTipsScreenProps {
    onClose: () => void;
}

const SafetyTipItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-5 p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-md font-bold text-sky-800 mb-1">{title}</h3>
        <p className="text-sm text-slate-600">{children}</p>
    </div>
);

export const SafetyTipsScreen: React.FC<SafetyTipsScreenProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-40 bg-slate-100 flex flex-col animate-slide-in-right">
            <header className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-20">
                <button onClick={onClose} className="p-2 -ml-2 mr-2">
                    <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-800">Dicas de Segurança</h1>
            </header>

            <main className="flex-grow overflow-y-auto p-6">
                <div className="mb-6">
                    <p className="text-slate-700 font-semibold mb-2">Sua segurança é nossa prioridade.</p>
                    <p className="text-sm text-slate-600">
                        Conectar-se com novas pessoas é emocionante, mas é crucial ser prudente. Estas dicas são um guia para ajudá-lo(a) a ter a experiência mais segura e positiva possível. Lembre-se, você está no controle.
                    </p>
                </div>

                <div className="space-y-3">
                     <SafetyTipItem title="1. Nunca Envie Dinheiro ou Informações Financeiras">
                        ALERTA: Golpistas podem criar histórias convincentes para pedir ajuda financeira. Jamais compartilhe dados de cartão de crédito, senhas bancárias ou qualquer informação que possa ser usada para acessar suas contas.
                    </SafetyTipItem>
                    <SafetyTipItem title="2. Proteja Suas Informações Pessoais">
                        ALERTA: Seja cauteloso ao compartilhar informações que possam identificar onde você mora ou trabalha. Mantenha seu nome completo, endereço, e-mail ou número de telefone privados até que se sinta totalmente confortável.
                    </SafetyTipItem>
                     <SafetyTipItem title="3. Fique na Plataforma">
                        ALERTA: Conversar fora do aplicativo (ex: WhatsApp, redes sociais) muito cedo pode expô-lo(a) a riscos, pois perdemos a capacidade de monitorar e agir sobre comportamentos suspeitos. Mantenha as conversas no Cristão Connect nas fases iniciais.
                    </SafetyTipItem>
                    <SafetyTipItem title="4. Cuidado com Relacionamentos à Distância">
                        ALERTA: Desconfie de pessoas que afirmam ser do seu país, mas estão presas em outro lugar, especialmente se pedirem ajuda financeira para voltar. Cuidado com quem se recusa a fazer uma chamada de vídeo ou a se encontrar pessoalmente.
                    </SafetyTipItem>
                    <SafetyTipItem title="5. Denuncie Todos os Comportamentos Suspeitos">
                        ALERTA: Se alguém o pressionar por informações, parecer suspeito, usar linguagem ofensiva ou violar nossas regras, denuncie imediatamente. Sua denúncia é confidencial e protege toda a comunidade.
                    </SafetyTipItem>
                    <SafetyTipItem title="6. Não Tenha Pressa">
                        ALERTA: Leve o tempo que precisar para conhecer alguém. Não se sinta pressionado(a) a fazer nada que não queira. Uma conexão genuína e baseada na fé respeita o tempo e os limites de cada um.
                    </SafetyTipItem>
                    <SafetyTipItem title="7. Marque Encontros em Público e Permaneça em Público">
                        ALERTA: Para o primeiro encontro, escolha um local público e movimentado (café, restaurante, shopping). Evite locais privados ou isolados. Informe um amigo ou familiar sobre seus planos, incluindo onde você vai e com quem.
                    </SafetyTipItem>
                    <SafetyTipItem title="8. Esteja no Controle do Seu Transporte">
                        ALERTA: Vá e volte do encontro com seu próprio meio de transporte. Não aceite caronas de alguém que você ainda não conhece bem. Isso garante que você possa ir embora a qualquer momento.
                    </SafetyTipItem>
                    <SafetyTipItem title="9. Conheça Seus Limites com Bebidas">
                        ALERTA: Mantenha o controle sobre suas bebidas e não as deixe desacompanhadas. Conheça seus limites para se manter ciente e no controle da situação.
                    </SafetyTipItem>
                    <SafetyTipItem title="10. Se Você se Sentir Desconfortável, Vá Embora">
                        ALERTA: Confie na sua intuição. Se algo não parecer certo ou se você se sentir desconfortável por qualquer motivo, não hesite em encerrar o encontro educadamente. Sua segurança vem em primeiro lugar.
                    </SafetyTipItem>
                </div>
            </main>
        </div>
    );
};