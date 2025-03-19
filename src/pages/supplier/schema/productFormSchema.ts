
import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  price: z.number().min(0.01, { message: "Le prix doit être supérieur à 0" }),
  original_price: z.number().nullable().optional(),
  category: z.string().min(1, { message: "Veuillez sélectionner une catégorie" }),
  subcategory: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  status: z.enum(["draft", "published", "archived"]),
  is_customizable: z.boolean().default(false),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const productVariantSchema = z.object({
  id: z.string().optional(),
  size: z.string().min(1, { message: "La taille est requise" }),
  color: z.string().min(1, { message: "La couleur est requise" }),
  hex_color: z.string().min(1, { message: "Le code hexadécimal est requis" }),
  stock: z.number().min(0, { message: "Le stock ne peut pas être négatif" }),
  price_adjustment: z.number().nullable().optional(),
  status: z.enum(["in_stock", "low_stock", "out_of_stock"]),
  isNew: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

export const productFormWithVariantsSchema = productFormSchema.extend({
  variants: z.array(productVariantSchema),
});
