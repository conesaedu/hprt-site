import seagullDriver from "@/assets/downloads/HPRT_12.0.exe.asset.json";
import printerUtility from "@/assets/downloads/HPRTPrinterUtility_V1.0.0.32.rar.asset.json";
import bartender from "@/assets/downloads/HPRT-Label-Designer-BT2016_R6_3141_UL.zip.asset.json";
import cpd80Utility from "@/assets/downloads/cpd80-utility.zip.asset.json";
import posDriver from "@/assets/downloads/HPRT_POS_Printer_Driver_v2.7.4.10.zip.asset.json";
import posUtility from "@/assets/downloads/HPRTUtilityForPOSSetup_V1.2.4.26.Test09.exe.7z.asset.json";
import cpd80Driver from "@/assets/downloads/Novo_Driver_HPRT_CP-D80.zip.asset.json";

/**
 * Os arquivos de driver ficam guardados no Lovable. Aqui eles são apontados
 * pelo endereço completo, para que o botão continue funcionando quando o site
 * for servido por outro servidor (ex.: Hostinger).
 */
const ASSET_ORIGIN = "https://hprtbrasil.lovable.app";

export type DownloadCategory = "Etiquetas e pulseiras" | "Cartões" | "Cupom / PDV";

export type DownloadKind = "Driver" | "Utilitário" | "Software" | "Firmware";

export type DownloadItem = {
  id: string;
  title: string;
  description: string;
  category: DownloadCategory;
  kind: DownloadKind;
  os: string;
  models: string[];
  /** URL do arquivo. Vazio = arquivo ainda não publicado. */
  file: string;
  format: string;
  version?: string;
};

const labelModels = [
  "ARES",
  "APOLLO",
  "HT500",
  "NEO",
  "GALA",
  "GRAND",
  "NYX",
  "GAMMA",
  "NYX-H",
];

export const downloadCategories: DownloadCategory[] = [
  "Etiquetas e pulseiras",
  "Cartões",
  "Cupom / PDV",
];

export const downloads: DownloadItem[] = [
  {
    id: "seagull-driver",
    title: "Driver Seagull para impressoras de etiquetas e pulseiras",
    description:
      "Driver Windows recomendado para instalação das impressoras de etiquetas e pulseiras HPRT. Instale antes de conectar o equipamento.",
    category: "Etiquetas e pulseiras",
    kind: "Driver",
    os: "Windows",
    models: labelModels,
    file: ASSET_ORIGIN + seagullDriver.url,
    format: "EXE",
    version: "12.0",
  },
  {
    id: "printer-utility",
    title: "HPRT Printer Utility em português",
    description:
      "Utilitário de configuração das impressoras de etiquetas: calibração de sensor, velocidade, temperatura, interface e testes de impressão.",
    category: "Etiquetas e pulseiras",
    kind: "Utilitário",
    os: "Windows",
    models: labelModels,
    file: ASSET_ORIGIN + printerUtility.url,
    format: "RAR",
    version: "1.0.0.32",
  },
  {
    id: "bartender-ultralite",
    title: "HPRT BarTender Ultralite",
    description:
      "Software de criação e impressão de etiquetas licenciado para impressoras HPRT. Layouts, códigos de barras e bases de dados.",
    category: "Etiquetas e pulseiras",
    kind: "Software",
    os: "Windows",
    models: labelModels,
    file: ASSET_ORIGIN + bartender.url,
    format: "ZIP",
    version: "BT2016_R6_3141_UL",
  },
  {
    id: "cpd80-driver",
    title: "Driver e firmware para impressora de cartões CP-D80",
    description:
      "Pacote de instalação com driver e firmware da impressora de cartões CP-D80.",
    category: "Cartões",
    kind: "Driver",
    os: "Windows",
    models: ["CP-D80"],
    file: ASSET_ORIGIN + cpd80Driver.url,
    format: "ZIP",
  },
  {
    id: "cpd80-tool",
    title: "Ferramenta de configuração CP-D80",
    description:
      "Aplicativo de calibração e ajuste de parâmetros de impressão da impressora de cartões CP-D80.",
    category: "Cartões",
    kind: "Utilitário",
    os: "Windows",
    models: ["CP-D80"],
    file: ASSET_ORIGIN + cpd80Utility.url,
    format: "ZIP",
  },
  {
    id: "pos-driver",
    title: "Driver para impressora de cupom",
    description:
      "Driver Windows das impressoras térmicas de cupom não fiscal para uso em PDV e retaguarda.",
    category: "Cupom / PDV",
    kind: "Driver",
    os: "Windows",
    models: ["TP80K"],
    file: ASSET_ORIGIN + posDriver.url,
    format: "ZIP",
    version: "2.7.4.10",
  },
  {
    id: "pos-utility",
    title: "Ferramenta de configuração para impressora de cupom",
    description:
      "Utilitário de configuração de interface, densidade e testes das impressoras de cupom HPRT.",
    category: "Cupom / PDV",
    kind: "Utilitário",
    os: "Windows",
    models: ["TP80K"],
    file: ASSET_ORIGIN + posUtility.url,
    format: "7Z",
    version: "1.2.4.26",
  },
];
