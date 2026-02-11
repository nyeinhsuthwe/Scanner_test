import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

function CodePreview({ code }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const barcodeRef = useRef(null);

  useEffect(() => {
    let active = true;

    const generateQr = async () => {
      if (!code) {
        setQrDataUrl('');
        return;
      }

      const dataUrl = await QRCode.toDataURL(code, {
        width: 180,
        margin: 1,
        color: {
          dark: '#111827',
          light: '#ffffff'
        }
      });

      if (active) {
        setQrDataUrl(dataUrl);
      }
    };

    generateQr();

    return () => {
      active = false;
    };
  }, [code]);

  useEffect(() => {
    if (!code || !barcodeRef.current) {
      return;
    }

    JsBarcode(barcodeRef.current, code, {
      format: 'CODE128',
      displayValue: true,
      height: 60,
      margin: 0,
      fontSize: 14,
      lineColor: '#111827'
    });
  }, [code]);

  if (!code) {
    return null;
  }

  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold text-slate-800">Generated Codes</h3>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="rounded-lg border p-3">
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">QR Code</p>
          {qrDataUrl ? <img src={qrDataUrl} alt={`QR for ${code}`} className="h-44 w-44" /> : null}
        </div>

        <div className="w-full rounded-lg border p-3">
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Barcode</p>
          <svg ref={barcodeRef} className="w-full" aria-label={`Barcode for ${code}`} />
        </div>
      </div>
    </section>
  );
}

export default CodePreview;
