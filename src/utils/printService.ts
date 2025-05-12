import { toRaw } from 'vue'
import type { OrdemServico, Cliente, ConfiguracaoEmpresa } from '@/types'

interface PrintOptions {
  title?: string
  copies?: number
  showPrintDialog?: boolean
}

export async function printOrdemServico(
  ordem: OrdemServico, 
  cliente: Cliente, 
  configuracao: ConfiguracaoEmpresa,
  options: PrintOptions = {}
) {
  const { 
    title = `Ordem de Serviço #${ordem.id}`,
    copies = 2,
    showPrintDialog = true
  } = options
  
  // Criamos um iframe oculto para a impressão não interferir na página atual
  const printFrame = document.createElement('iframe')
  printFrame.style.position = 'fixed'
  printFrame.style.right = '0'
  printFrame.style.bottom = '0'
  printFrame.style.width = '0'
  printFrame.style.height = '0'
  printFrame.style.border = '0'
  document.body.appendChild(printFrame)
  
  // Convertemos objetos reativos do Vue para objetos JS normais
  const ordemRaw = toRaw(ordem)
  const clienteRaw = toRaw(cliente)
  const configuracaoRaw = toRaw(configuracao)
  
  // Função para formatar data
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }
  
  // Geramos o conteúdo HTML para impressão
  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        @media print {
          @page {
            size: A4;
            margin: 7mm;
          }
          
          * {
            box-sizing: border-box;
          }
          
          body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            line-height: 1.3;
            color: #000;
            margin: 0;
            padding: 0;
          }
          
          .ordem-servico {
            page-break-after: always;
            position: relative;
            max-height: 277mm; /* Ajuste para garantir que caiba em uma página */
          }
          
          .ordem-servico:last-child {
            page-break-after: avoid;
          }
          
          .header {
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
          }
          
          .logo {
            max-width: 70px;
            max-height: 70px;
            margin-right: 15px;
          }
          
          .empresa-info {
            flex: 1;
            font-size: 9pt;
          }
          
          .empresa-info h1 {
            font-size: 14pt;
            margin: 0 0 3px 0;
          }
          
          .empresa-info p {
            margin: 1px 0;
          }
          
          .ordem-info {
            text-align: right;
            font-weight: bold;
            font-size: 9pt;
          }
          
          .ordem-info div:nth-child(2) {
            font-size: 16pt;
            margin: 2px 0;
          }
          
          .section {
            margin-bottom: 8px;
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 5px 8px;
          }
          
          .main-sections {
            display: flex;
            gap: 8px;
            margin-bottom: 8px;
          }
          
          .main-sections .section {
            flex: 1;
            margin-bottom: 0;
          }
          
          .col-layout {
            display: flex;
            gap: 8px;
          }
          
          .col-layout .section {
            flex: 1;
          }
          
          .section-title {
            font-weight: bold;
            margin-bottom: 5px;
            border-bottom: 1px solid #eee;
            padding-bottom: 3px;
            font-size: 10pt;
          }
          
          .grid {
            display: grid;
            grid-template-columns: 80px 1fr;
            gap: 2px;
            font-size: 9pt;
          }
          
          .bold {
            font-weight: bold;
          }
          
          .status-box {
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 3px 6px;
            display: inline-block;
            font-weight: bold;
            font-size: 9pt;
          }
          
          .assinaturas {
            margin-top: 15px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          
          .assinatura {
            border-top: 1px solid #000;
            padding-top: 3px;
            text-align: center;
            font-size: 9pt;
          }
          
          .assinatura p {
            margin: 0;
          }
          
          .footer {
            text-align: center;
            font-size: 8pt;
            color: #666;
            margin-top: 8px;
            border-top: 1px solid #eee;
            padding-top: 5px;
          }
          
          .footer p {
            margin: 0;
          }
          
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80px;
            opacity: 0.07;
            color: #999;
            z-index: -1;
            pointer-events: none;
          }
          
          .copia {
            font-size: 14pt;
            font-weight: bold;
            text-align: right;
            color: #555;
            margin-bottom: 5px;
            position: absolute;
            top: 5px;
            right: 5px;
            border: 1px solid #ddd;
            padding: 2px 8px;
            border-radius: 4px;
            background-color: #f9f9f9;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
          }
          
          th {
            text-align: left;
            border-bottom: 1px solid #ddd;
            padding: 3px 0;
          }
          
          td {
            padding: 3px 0;
          }
          
          .problema {
            font-size: 9pt;
          }
          
          .termos-list {
            font-size: 9pt;
            margin: 5px 0;
            padding-left: 15px;
          }
          
          .termos-list li {
            margin-bottom: 2px;
          }
        }
      </style>
    </head>
    <body>
      ${Array(copies).fill(null).map((_, index) => `
        <div class="ordem-servico">
          <div class="watermark">ORDEM DE SERVIÇO</div>
          <div class="copia">${index === 0 ? 'VIA CLIENTE' : 'VIA EMPRESA'}</div>
          <div class="header">
            ${configuracaoRaw.logo ? `<img src="${configuracaoRaw.logo}" class="logo" alt="Logo da empresa">` : ''}
            <div class="empresa-info">
              <h1>${configuracaoRaw.nomeEmpresa}</h1>
              <p>${configuracaoRaw.endereco}</p>
              <p>CNPJ: ${configuracaoRaw.cnpj} | Tel: ${configuracaoRaw.telefone}</p>
              <p>Email: ${configuracaoRaw.email}</p>
            </div>
            <div class="ordem-info">
              <div>ORDEM DE SERVIÇO</div>
              <div>Nº ${ordemRaw.id}</div>
              <div>Emissão: ${formatDate(ordemRaw.dataCriacao)}</div>
            </div>
          </div>
          
          <div class="main-sections">
            <div class="section">
              <div class="section-title">DADOS DO CLIENTE</div>
              <div class="grid">
                <div class="bold">Nome:</div>
                <div>${clienteRaw.nome}</div>
                
                <div class="bold">CPF/CNPJ:</div>
                <div>${clienteRaw.cpf}</div>
                
                <div class="bold">Telefone:</div>
                <div>${clienteRaw.telefone}</div>
                
                <div class="bold">Email:</div>
                <div>${clienteRaw.email}</div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">EQUIPAMENTO</div>
              <div class="grid">
                <div class="bold">Equipamento:</div>
                <div>${ordemRaw.equipamento}</div>
                
                <div class="bold">Marca:</div>
                <div>${ordemRaw.marca}</div>
                
                <div class="bold">Modelo:</div>
                <div>${ordemRaw.modelo}</div>
                
                <div class="bold">Nº de Série:</div>
                <div>${ordemRaw.numeroSerie}</div>
              </div>
            </div>
          </div>
          
          <div class="col-layout">
            <div class="section">
              <div class="section-title">PROBLEMA RELATADO</div>
              <p class="problema">${ordemRaw.defeito}</p>
              ${ordemRaw.descricaoProblema ? `<p class="problema">${ordemRaw.descricaoProblema}</p>` : ''}
            </div>
            
            <div class="section">
              <div class="section-title">STATUS DO SERVIÇO</div>
              <div class="status-box">
                ${
                  ordemRaw.status === 'pendente' ? 'PENDENTE' :
                  ordemRaw.status === 'em_andamento' ? 'EM ANDAMENTO' :
                  ordemRaw.status === 'em_analise' ? 'EM ANÁLISE' :
                  ordemRaw.status === 'aguardando' ? 'AGUARDANDO' :
                  ordemRaw.status === 'orcamento' ? 'AGUARDANDO APROVAÇÃO' :
                  ordemRaw.status === 'aprovado' ? 'ORÇAMENTO APROVADO' :
                  ordemRaw.status === 'em_execucao' ? 'EM EXECUÇÃO' :
                  ordemRaw.status === 'concluido' ? 'CONCLUÍDO' :
                  'CANCELADO'
                }
              </div>
              
              <div class="grid" style="margin-top: 4px;">
                ${ordemRaw.dataPrevisao ? `
                <div class="bold">Previsão:</div>
                <div>${formatDate(ordemRaw.dataPrevisao)}</div>
                ` : ''}
                
                ${ordemRaw.tecnicoResponsavel ? `
                <div class="bold">Técnico:</div>
                <div>${ordemRaw.tecnicoResponsavel}</div>
                ` : ''}
              </div>
            </div>
          </div>
          
          ${ordemRaw.orcamento ? `
            <div class="section">
              <div class="section-title">ORÇAMENTO</div>
              <table>
                <thead>
                  <tr>
                    <th style="text-align: left; width: 70%;">Descrição</th>
                    <th style="text-align: right; width: 30%;">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  ${ordemRaw.orcamento.itens.map(item => `
                    <tr>
                      <td>${item.descricao}</td>
                      <td style="text-align: right;">R$ ${item.valor.toFixed(2)}</td>
                    </tr>
                  `).join('')}
                  <tr>
                    <td style="text-align: right; font-weight: bold; padding-top: 5px;">TOTAL:</td>
                    <td style="text-align: right; font-weight: bold; padding-top: 5px;">R$ ${ordemRaw.orcamento.valor.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ` : ''}
          
          <div class="section">
            <div class="section-title">TERMOS E CONDIÇÕES</div>
            <ul class="termos-list">
              <li>A garantia dos serviços é de ${configuracaoRaw.termosGarantia}.</li>
              <li>Os dados e arquivos presentes no equipamento são de responsabilidade exclusiva do cliente.</li>
              <li>Equipamentos não retirados em até 90 dias após a conclusão do serviço serão considerados abandonados.</li>
              <li>O prazo para reclamações é de 7 dias após a entrega do equipamento.</li>
            </ul>
          </div>
          
          <div class="assinaturas">
            <div class="assinatura">
              <p>__________________________________</p>
              <p>Cliente</p>
            </div>
            <div class="assinatura">
              <p>__________________________________</p>
              <p>Responsável Técnico</p>
            </div>
          </div>
          
          <div class="footer">
            <p>${configuracaoRaw.nomeEmpresa} - ${configuracaoRaw.cnpj} - ${configuracaoRaw.endereco} - Tel: ${configuracaoRaw.telefone}</p>
          </div>
        </div>
      `).join('')}
    </body>
    </html>
  `
  
  // Atribuímos o conteúdo HTML ao iframe
  const frameDocument = printFrame.contentDocument
  frameDocument!.open()
  frameDocument!.write(content)
  frameDocument!.close()
  
  // Esperamos o carregamento de estilos e imagens
  return new Promise<void>((resolve) => {
    printFrame.onload = () => {
      try {
        // Chamamos a função de impressão
        const contentWindow = printFrame.contentWindow
        if (contentWindow) {
          if (showPrintDialog) {
            contentWindow.print()
          } else {
            contentWindow.print()
            contentWindow.close()
          }
        }
      } catch (error) {
        console.error('Erro ao imprimir:', error)
      } finally {
        // Aguardamos um tempo antes de remover o iframe
        setTimeout(() => {
          document.body.removeChild(printFrame)
          resolve()
        }, 1000)
      }
    }
  })
} 