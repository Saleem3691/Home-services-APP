import { Schema, model, models } from 'mongoose';

const contactMessageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ContactMessage = models.ContactMessage || model('ContactMessage', contactMessageSchema);

export default ContactMessage;