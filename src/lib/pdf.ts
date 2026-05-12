import { jsPDF } from "jspdf";
import { Destination, DestinationImage } from "./types";

const PRIMARY_COLOR: [number, number, number] = [2, 132, 199];
const ACCENT_COLOR: [number, number, number] = [241, 245, 249];
const TEXT_MAIN: [number, number, number] = [15, 23, 42];
const TEXT_MUTED: [number, number, number] = [71, 85, 105];

function getLocationLabel(destination: Destination) {
  return [destination.city, destination.state, destination.country].filter(Boolean).join(", ");
}

function getGalleryImages(destination: Destination): DestinationImage[] {
  if (destination.galleryImages?.length) return destination.galleryImages;

  return [
    {
      url: destination.image,
      alt: destination.name,
      caption: `${destination.name} signature view`,
    },
  ];
}

async function addImageFromUrl(
  doc: jsPDF,
  url: string,
  x: number,
  y: number,
  width: number,
  height: number
) {
  return new Promise<boolean>((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(false);
        return;
      }

      ctx.drawImage(img, 0, 0);
      doc.addImage(canvas.toDataURL("image/jpeg", 0.78), "JPEG", x, y, width, height);
      resolve(true);
    };
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

function addBrandRail(doc: jsPDF, pageHeight: number) {
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(0, 0, 5, pageHeight, "F");
}

function addFooter(doc: jsPDF, pageWidth: number, pageHeight: number) {
  doc.setFontSize(8);
  doc.setTextColor(...TEXT_MUTED);
  doc.text("TRAVELGATEWAY.IN | +91 9898111689", pageWidth / 2, pageHeight - 10, {
    align: "center",
  });
}

function addSectionTitle(doc: jsPDF, title: string, x: number, y: number) {
  doc.setTextColor(...TEXT_MAIN);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(title, x, y);
}

export async function generateDestinationPDF(destination: Destination) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const locationLabel = getLocationLabel(destination) || destination.country;
  const galleryImages = getGalleryImages(destination);

  addBrandRail(doc, pageHeight);
  doc.setTextColor(...PRIMARY_COLOR);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("TRAVEL GATEWAY", 20, 30);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...TEXT_MUTED);
  doc.text("CURATED JOURNEYS BY VISHAL HARLALKA", 20, 38);

  await addImageFromUrl(doc, destination.image, 20, 50, pageWidth - 40, 82);

  doc.setTextColor(...TEXT_MAIN);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(destination.name.toUpperCase(), pageWidth - 50);
  doc.text(titleLines, 20, 150);

  const titleBottomY = 150 + titleLines.length * 10;
  doc.setFontSize(12);
  doc.setTextColor(...PRIMARY_COLOR);
  doc.text(`${locationLabel} | Starting from ${destination.price}* per person | T&C apply`, 20, titleBottomY);

  doc.setFillColor(...ACCENT_COLOR);
  doc.roundedRect(20, 178, pageWidth - 40, 58, 4, 4, "F");
  doc.setTextColor(...TEXT_MAIN);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("JOURNEY HIGHLIGHTS", 30, 191);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...TEXT_MUTED);
  const summaryText = destination.longDescription || destination.description;
  doc.text(doc.splitTextToSize(summaryText, pageWidth - 60).slice(0, 6), 30, 202);
  doc.setFontSize(8);
  doc.setTextColor(...TEXT_MUTED);
  doc.text("*Indicative quote only. Booking is confirmed only after written company confirmation. Government taxes extra.", 30, 230);
  addFooter(doc, pageWidth, pageHeight);

  doc.addPage();
  addBrandRail(doc, pageHeight);
  addSectionTitle(doc, "DETAILED ITINERARY", 20, 30);

  let currentY = 45;
  destination.itinerary?.forEach((item, index) => {
    if (currentY > 238) {
      addFooter(doc, pageWidth, pageHeight);
      doc.addPage();
      addBrandRail(doc, pageHeight);
      currentY = 30;
    }

    doc.setFillColor(...PRIMARY_COLOR);
    doc.circle(28, currentY + 5, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(`${index + 1}`, 28, currentY + 8, { align: "center" });

    doc.setTextColor(...TEXT_MAIN);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(item.title.toUpperCase(), 38, currentY + 7);

    doc.setFontSize(9);
    doc.setTextColor(...PRIMARY_COLOR);
    doc.text(item.day, 38, currentY + 12);

    doc.setFontSize(10);
    doc.setTextColor(...TEXT_MUTED);
    doc.setFont("helvetica", "normal");
    const splitDesc = doc.splitTextToSize(item.description, pageWidth - 60);
    doc.text(splitDesc, 38, currentY + 18);
    currentY += splitDesc.length * 5 + 20;
  });
  addFooter(doc, pageWidth, pageHeight);

  doc.addPage();
  addBrandRail(doc, pageHeight);
  addSectionTitle(doc, "IMAGE DOWNLOAD SECTION", 20, 30);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...TEXT_MUTED);
  doc.text("High-definition destination visuals included for itinerary review.", 20, 39);

  let imageY = 50;
  for (const image of galleryImages.slice(0, 6)) {
    if (imageY > 220) {
      addFooter(doc, pageWidth, pageHeight);
      doc.addPage();
      addBrandRail(doc, pageHeight);
      addSectionTitle(doc, "IMAGE DOWNLOAD SECTION", 20, 30);
      imageY = 45;
    }

    const added = await addImageFromUrl(doc, image.url, 20, imageY, pageWidth - 40, 74);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(added ? TEXT_MAIN[0] : TEXT_MUTED[0], added ? TEXT_MAIN[1] : TEXT_MUTED[1], added ? TEXT_MAIN[2] : TEXT_MUTED[2]);
    doc.text(image.caption, 20, imageY + 82);
    imageY += 96;
  }

  addFooter(doc, pageWidth, pageHeight);
  doc.save(`${destination.name}-TravelGateway-Brochure.pdf`);
}
