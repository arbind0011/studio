
'use server';

import { addVisitorLog } from '@/services/visitorService';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2),
  aadhar: z.string().regex(/^[0-9]{12}$/),
  phone: z.string().regex(/^[0-9]{10}$/),
  address: z.string().min(10),
  email: z.string().email(),
});

export type VisitorFormInput = z.infer<typeof formSchema>;

export async function submitVisitorData(data: VisitorFormInput) {
    const validatedData = formSchema.safeParse(data);

    if (!validatedData.success) {
        return { error: 'Invalid data provided.' };
    }

    try {
        await addVisitorLog(validatedData.data);
        return { success: true };
    } catch (e) {
        console.error("Failed to add visitor log:", e);
        return { error: 'There was an error submitting your information. Please try again.' };
    }
}
