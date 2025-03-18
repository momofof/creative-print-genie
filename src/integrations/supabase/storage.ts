
import { supabase } from './client';

// Fonction pour créer un bucket s'il n'existe pas déjà
export const createBucketIfNotExists = async (bucketName: string) => {
  try {
    // Vérifier si le bucket existe déjà
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Créer le bucket avec accès public
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 2097152, // 2MB en octets
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif']
      });
      
      if (error) {
        console.error(`Erreur lors de la création du bucket ${bucketName}:`, error);
        return false;
      }
      
      console.log(`Bucket ${bucketName} créé avec succès`);
      return true;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur lors de la vérification/création du bucket ${bucketName}:`, error);
    return false;
  }
};

// Fonction pour télécharger une image
export const uploadImage = async (
  bucketName: string,
  filePath: string,
  file: File
): Promise<string | null> => {
  try {
    // Vérifier que le bucket existe
    await createBucketIfNotExists(bucketName);
    
    // Télécharger le fichier
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error(`Erreur lors du téléchargement vers ${bucketName}/${filePath}:`, error);
      return null;
    }
    
    // Obtenir l'URL publique du fichier
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error(`Erreur lors du téléchargement de l'image:`, error);
    return null;
  }
};

// Fonction pour supprimer une image
export const deleteImage = async (
  bucketName: string,
  filePath: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      console.error(`Erreur lors de la suppression de ${bucketName}/${filePath}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'image:`, error);
    return false;
  }
};

// Initialiser les buckets nécessaires au démarrage de l'application
export const initStorage = async () => {
  await createBucketIfNotExists('product-images');
};
