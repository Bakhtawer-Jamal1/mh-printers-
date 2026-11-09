export const BUSINESS = {
  name: 'MH Printers & Enterprises',
  phoneDisplay: '+92 310 0777456',
  phoneE164: '+923100777456',
  whatsapp: '923100777456',
  email: 'hello@mhprinters.pk',
  address: 'Lahore, Pakistan',
}

export function whatsappUrl(message = 'Assalam-o-alaikum! I would like to know more about your printing services.') {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`
}