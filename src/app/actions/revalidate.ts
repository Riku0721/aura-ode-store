'use server'
import { revalidateTag, revalidatePath } from 'next/cache'

export async function revalidateSettings() {
  revalidateTag('settings')
  revalidatePath('/')
}

export async function revalidateProducts() {
  revalidateTag('products')
  revalidatePath('/products')
  revalidatePath('/')
}
