
'use server';

import { addVisitorLog } from '@/services/visitorService';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  aadhar: z.string().regex(/^[0-9]{12}$/, "Aadhar number must be 12 digits."),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits."),
  address: z.string().min(10, "Address must be at least 10 characters."),
  email: z.string().email("Please enter a valid email address."),
});

export type VisitorFormInput = z.infer<typeof formSchema>;

export async function submitVisitorData(data: VisitorFormInput) {
    const validatedData = formSchema.safeParse(data);

    if (!validatedData.success) {
        const errorMessage = validatedData.error.errors.map(e => e.message).join(', ');
        return { success: false, error: `Invalid data provided: ${errorMessage}` };
    }

    try {
        await addVisitorLog(validatedData.data);
        return { success: true };
    } catch (e) {
        console.error("Failed to add visitor log:", e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: `There was an error submitting your information: ${errorMessage}` };
    }
}
