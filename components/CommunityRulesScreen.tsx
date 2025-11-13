import React from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface CommunityRulesScreenProps {
    onClose: () => void;
}

const RuleItem: React.FC<{ number: number; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="mb-4">
        <h3 className="text-md font-bold text-slate-800 mb-1">{number}. {title}</h3>
        <p className="text-sm text-slate-600 pl-5">{children}</p>
    </div>
);

export const CommunityRulesScreen: React.FC<CommunityRulesScreenProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-40 bg-slate-100 flex flex-col animate-slide-in-right">
            <header className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-20">
                <button onClick={onClose} className="p-2 -ml-2 mr-2">
                    <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-800">Regras da Comunidade</h1>
            </header>

            <main className="flex-grow overflow-y-auto p-6">
                <div className="mb-6">
                    <p className="text-slate-700 font-semibold mb-2">Bem-vindo(a) ao PURPOSE MATCH!</p>
                    <p className="text-sm text-slate-600">
                        Nossa missão é cultivar um espaço seguro, respeitoso e edificante, onde conexões guiadas pela fé possam florescer. Para garantir que todos tenham uma experiência positiva, pedimos que você siga estas diretrizes, que são os pilares da nossa comunidade.
                    </p>
                </div>

                <div className="space-y-4">
                    <RuleItem number={1} title="Autenticidade em Tudo">
                        Seja você mesmo(a). Perfis devem ser genuínos, com fotos e informações atuais. A honestidade é o primeiro passo para construir confiança e uma conexão verdadeira.
                    </RuleItem>
                    <RuleItem number={2} title="Comunique-se com Respeito">
                        Trate todos com dignidade e respeito, como ensinado em Filipenses 2:3. Discursos de ódio, assédio, bullying ou qualquer forma de desrespeito não serão tolerados.
                    </RuleItem>
                    <RuleItem number={3} title="Gentileza Gera Gentileza">
                        Incentivamos interações que edificam. Seja amável em suas palavras e ações. Lembre-se que por trás de cada perfil existe uma pessoa com sentimentos e uma história.
                    </RuleItem>
                     <RuleItem number={4} title="Faça Conexões Pessoais, Nada de Networking">
                        Este é um espaço para encontrar relacionamentos significativos, não para promover negócios, eventos ou causas. Contas usadas para fins comerciais ou proselitismo serão removidas.
                    </RuleItem>
                    <RuleItem number={5} title="Compartilhe Conteúdo com Cautela">
                        Proteja sua privacidade e a dos outros. Não compartilhe informações pessoais sensíveis, como endereço, telefone ou dados financeiros, no seu perfil ou nas conversas iniciais.
                    </RuleItem>
                     <RuleItem number={6} title="Pense nos Limites">
                        Respeite o espaço e o tempo de resposta das outras pessoas. Se alguém não demonstrar interesse, aceite com graça e siga em frente. Pressionar ou insistir não é o caminho.
                    </RuleItem>
                    <RuleItem number={7} title="Fique Longe de Conteúdo Violento ou Inapropriado">
                        É estritamente proibido postar ou compartilhar qualquer conteúdo que seja sexualmente explícito, violento, ilegal ou que promova atividades perigosas.
                    </RuleItem>
                    <RuleItem number={8} title="Este Espaço é Seu: Poste Conteúdo Próprio">
                        Use apenas fotos e textos que você tem o direito de compartilhar. Não publique imagens de outras pessoas sem permissão ou conteúdo protegido por direitos autorais.
                    </RuleItem>
                    <RuleItem number={9} title="Seja um Usuário Legal e Cumpra a Lei">
                        Qualquer atividade ilegal, incluindo o uso do aplicativo para facilitar crimes, resultará em banimento imediato e, se necessário, denúncia às autoridades.
                    </RuleItem>
                    <RuleItem number={10} title="Somente Adultos">
                        Você deve ter 18 anos ou mais para usar o PURPOSE MATCH. Não permitimos a presença de menores de idade na plataforma.
                    </RuleItem>
                    <RuleItem number={11} title="Uma Pessoa, Uma Conta">
                        Cada usuário deve ter apenas uma conta. Contas duplicadas ou falsas serão removidas para manter a integridade da comunidade.
                    </RuleItem>
                    <RuleItem number={12} title="Entre na Aplicação com Frequência">
                        Uma comunidade ativa é uma comunidade saudável. Faça login regularmente para ver novos perfis e responder às suas mensagens.
                    </RuleItem>
                    <RuleItem number={13} title="Política de Inatividade">
                        Para manter nossa comunidade relevante e ativa, contas que permanecerem inativas por mais de 2 meses (60 dias) poderão ser encerradas. Queremos que as conexões aqui sejam com pessoas que estão presentes.
                    </RuleItem>
                     <RuleItem number={14} title="Use as Ferramentas de Segurança">
                        Se encontrar alguém que viole estas regras, use as ferramentas de denúncia e bloqueio. Sua colaboração é essencial para manter o PURPOSE MATCH um lugar seguro.
                    </RuleItem>
                </div>
                 <div className="mt-8 border-t border-slate-200 pt-4">
                    <p className="text-xs text-slate-500">
                        A violação destas regras pode resultar em advertências, remoção de conteúdo ou encerramento permanente da conta, a nosso critério. Agradecemos por nos ajudar a construir a melhor comunidade para encontros cristãos.
                    </p>
                </div>
            </main>
        </div>
    );
};