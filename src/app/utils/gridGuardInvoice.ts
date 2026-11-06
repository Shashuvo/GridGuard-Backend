const COLOR = {
    yellow: "#FFC400",
    ink: "#1A1400",
    gold: "#8A6500",
    muted: "#7A7048",
    cream: "#FFF8DC",
    line: "#F0E3AE",
  };
  
  const PAGE_W = 595.28;
  const MARGIN = 48;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  
  type InvoiceUser = {
    user: { name: string; email: string };
    package: { name: string; durationDays: number };
    area: { name: string; district: string };
    startDate: Date;
    expiresAt: Date;
  };
  
  type InvoicePayment = {
    amount: string | number;
    trxID: string;
    paymentExecuteTime: string;
  };
  
  const fmtDate = (d: Date | string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  
  const label = (doc: PDFKit.PDFDocument, text: string, x: number, y: number, opts = {}) =>
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor(COLOR.gold)
      .text(text.toUpperCase(), x, y, { characterSpacing: 1, lineBreak: false, ...opts });
  
  const detailTable = (
    doc: PDFKit.PDFDocument,
    y: number,
    rows: [string, string][],
  ): number => {
    const rowH = 34;
    const h = rows.length * rowH;
  
    doc.roundedRect(MARGIN, y, CONTENT_W, h, 10).fillAndStroke(COLOR.cream, COLOR.line);
  
    rows.forEach(([key, value], i) => {
      const top = y + i * rowH;
      if (i > 0) {
        doc
          .moveTo(MARGIN + 18, top)
          .lineTo(MARGIN + CONTENT_W - 18, top)
          .lineWidth(0.8)
          .strokeColor(COLOR.line)
          .stroke();
      }
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(COLOR.muted)
        .text(key, MARGIN + 18, top + 12, { width: 150, lineBreak: false });
      doc
        .font("Helvetica-Bold")
        .fontSize(10.5)
        .fillColor(COLOR.ink)
        .text(value, MARGIN + 170, top + 12, {
          width: CONTENT_W - 170 - 18,
          align: "right",
          lineBreak: false,
          ellipsis: true,
        });
    });
  
    return y + h;
  };
  
  export const drawGridGuardInvoice = (
    doc: PDFKit.PDFDocument,
    premiumUser: InvoiceUser,
    payment: InvoicePayment,
  ) => {
    // ---------- Header band ----------
    doc.rect(0, 0, PAGE_W, 112).fill(COLOR.yellow);
  
    // Logo mark (vector): dark rounded square with yellow lightning bolt
    doc.roundedRect(MARGIN, 32, 48, 48, 12).fill(COLOR.ink);
    doc.save();
    doc.translate(MARGIN, 32).scale(0.75);
    doc.path("M35 13 L20 36 H30 L27 51 L43 27 H34 Z").fill(COLOR.yellow);
    doc.restore();
  
    doc
      .font("Helvetica-Bold")
      .fontSize(25)
      .fillColor(COLOR.ink)
      .text("GridGuard", MARGIN + 62, 36, { lineBreak: false });
    doc
      .font("Helvetica")
      .fontSize(9.5)
      .fillColor("#5C4A00")
      .text("Smart power outage & load-shedding management", MARGIN + 62, 66, {
        lineBreak: false,
      });
  
    doc
      .font("Helvetica-Bold")
      .fontSize(22)
      .fillColor(COLOR.ink)
      .text("INVOICE", MARGIN, 36, { width: CONTENT_W, align: "right", lineBreak: false });
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#5C4A00")
      .text("Premium Subscription", MARGIN, 66, {
        width: CONTENT_W,
        align: "right",
        lineBreak: false,
      });
  
    // ---------- Billed to / invoice info ----------
    let y = 146;
    label(doc, "Billed to", MARGIN, y);
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor(COLOR.ink)
      .text(premiumUser.user.name, MARGIN, y + 16, { lineBreak: false });
    doc
      .font("Helvetica")
      .fontSize(10.5)
      .fillColor(COLOR.muted)
      .text(premiumUser.user.email, MARGIN, y + 36, { lineBreak: false });
  
    const rightX = MARGIN + CONTENT_W / 2;
    const rightW = CONTENT_W / 2;
    label(doc, "Invoice date", rightX, y, { width: rightW, align: "right" });
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(COLOR.ink)
      .text(fmtDate(new Date()), rightX, y + 16, {
        width: rightW,
        align: "right",
        lineBreak: false,
      });
    label(doc, "Transaction ID", rightX, y + 40, { width: rightW, align: "right" });
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(COLOR.ink)
      .text(payment.trxID, rightX, y + 56, {
        width: rightW,
        align: "right",
        lineBreak: false,
      });
  
    // ---------- Subscription details ----------
    y = 250;
    label(doc, "Subscription details", MARGIN, y);
    y = detailTable(doc, y + 18, [
      ["Package", premiumUser.package.name],
      ["Duration", `${premiumUser.package.durationDays} days`],
      ["Area", `${premiumUser.area.name}, ${premiumUser.area.district}`],
      ["Subscription start", fmtDate(premiumUser.startDate)],
      ["Subscription expires", fmtDate(premiumUser.expiresAt)],
    ]);
  
    // ---------- Payment details ----------
    y += 28;
    label(doc, "Payment details", MARGIN, y);
    y = detailTable(doc, y + 18, [
      ["Payment method", "bKash"],
      ["Transaction ID", payment.trxID],
      ["Paid at", String(payment.paymentExecuteTime)],
    ]);
  
    // ---------- Amount paid ----------
    y += 18;
    doc.roundedRect(MARGIN, y, CONTENT_W, 62, 12).fill(COLOR.yellow);
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor("#5C4A00")
      .text("AMOUNT PAID", MARGIN + 22, y + 15, { characterSpacing: 1, lineBreak: false });
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(COLOR.ink)
      .text("PAID IN FULL", MARGIN + 22, y + 32, { lineBreak: false });
    doc
      .font("Helvetica-Bold")
      .fontSize(26)
      .fillColor(COLOR.ink)
      .text(`${payment.amount} BDT`, MARGIN + 150, y + 18, {
        width: CONTENT_W - 150 - 22,
        align: "right",
        lineBreak: false,
      });
    y += 62;
  
    // ---------- Thank-you note ----------
    y += 26;
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(COLOR.muted)
      .text(
        "Thank you for subscribing! You will now receive real-time notifications about power outages in your area.",
        MARGIN + 30,
        y,
        { width: CONTENT_W - 60, align: "center" },
      );
  
    // ---------- Footer ----------
    doc
      .moveTo(MARGIN, 758)
      .lineTo(MARGIN + CONTENT_W, 758)
      .lineWidth(0.8)
      .strokeColor(COLOR.line)
      .stroke();
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#A39A74")
      .text("© GridGuard. All rights reserved.", MARGIN, 768, {
        width: CONTENT_W,
        align: "center",
        lineBreak: false,
      });
  };