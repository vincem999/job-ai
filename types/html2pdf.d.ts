declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number] | [number, number, number, number]
    filename?: string
    image?: {
      type?: 'jpeg' | 'png' | 'webp'
      quality?: number
    }
    html2canvas?: {
      scale?: number
      useCORS?: boolean
      allowTaint?: boolean
    }
    jsPDF?: {
      unit?: 'pt' | 'mm' | 'cm' | 'in'
      format?: 'a4' | 'letter' | 'legal'
      orientation?: 'portrait' | 'landscape'
    }
  }

  interface Html2Pdf {
    set(options: Html2PdfOptions): Html2Pdf
    from(element: HTMLElement): Html2Pdf
    output(type: 'blob' | 'pdf'): Promise<Blob>
  }

  function html2pdf(): Html2Pdf
  export default html2pdf
}