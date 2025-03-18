
/**
 * Fonctions utilitaires pour la gestion des fichiers CSV
 */

/**
 * Génère un fichier CSV modèle pour l'importation de produits
 * @returns Blob du fichier CSV
 */
export const generateProductCsvTemplate = (): Blob => {
  const headers = [
    'name',
    'price',
    'original_price',
    'category',
    'subcategory',
    'description',
    'status',
    'is_customizable',
    'stock'
  ].join(',');
  
  const exampleRow = [
    'T-shirt Exemple',
    '29.99',
    '39.99',
    'vêtements',
    't-shirts',
    'Description du produit',
    'draft',
    'false',
    '50'
  ].join(',');
  
  const csvContent = `${headers}\n${exampleRow}`;
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
};

/**
 * Génère un fichier CSV modèle pour l'importation de variantes
 * @returns Blob du fichier CSV
 */
export const generateVariantCsvTemplate = (): Blob => {
  const headers = [
    'size',
    'color',
    'hex_color',
    'stock',
    'price_adjustment',
    'status'
  ].join(',');
  
  const exampleRows = [
    ['S', 'Noir', '#000000', '10', '0', 'in_stock'].join(','),
    ['M', 'Noir', '#000000', '15', '0', 'in_stock'].join(','),
    ['L', 'Noir', '#000000', '12', '0', 'in_stock'].join(','),
    ['S', 'Blanc', '#FFFFFF', '8', '0', 'in_stock'].join(','),
    ['M', 'Blanc', '#FFFFFF', '20', '0', 'in_stock'].join(','),
    ['L', 'Blanc', '#FFFFFF', '18', '0', 'in_stock'].join(',')
  ].join('\n');
  
  const csvContent = `${headers}\n${exampleRows}`;
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
};

/**
 * Télécharge un fichier CSV
 * @param blob Le blob du fichier
 * @param filename Nom du fichier
 */
export const downloadCsv = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
