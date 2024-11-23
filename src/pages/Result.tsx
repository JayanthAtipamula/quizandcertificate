import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuiz } from '../context/QuizContext';
import { Download, Trophy } from 'lucide-react';
import Confetti from 'react-confetti';
import { ChangeEvent, FormEvent } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import '@fontsource/pinyon-script';
import '@fontsource/playfair-display/700.css';
import '@fontsource/montserrat';

interface UserDetails {
  name: string;
  phone: string;
  email: string;
}

const LOGO_BASE64 = "data:image/webp;base64,UklGRm4QAABXRUJQVlA4TGEQAAAvH8OVEC8QEUQCpElmkF1htRv4LvB029aWZtu2uW1oHWOs4wd1EkMdo1s9wsb//zHHnmStORe4jo/zJKL/smjbrmFpYbiUnK5D5HHykNJ/q78d0+I/i/8s/rP4z+I/i/8s/rP4z+I/i/8s/rP4z+I/i/8s/rP4z39V2R6Ox+327wGH98s9j9+m+/1yCs7fcx8F08dp63TK9zyKp/spePyvUTelk8uP0P7x4mlkf4kisBc37x1G2HQOPk7M5RE4tdHDh43YKe3ce9hthE9n31L9cBj0qODZZRxHzuzZhTb79VPi7NaFOTt14c4uXf5WzGUe6VPtTIbRwPTqSj5HE9POkbyNNkjRoRL4AtxZzvJ3QUA/GppenXiQqSk6Msdj5hgv7vs7sasZrZGiG/cZEuhLg4D/zQPVaJEU3JcD/Tux6wq81+6X2x0YxUXfukmXl2349j23x1t27eqK2fO73zleEHPh1XWSNvcpP71qHXiMWjSNr6qbS1elulWJMrl8GBy66rV79b7o052rit8I7s2bRZS98ioaKF5eu3J9NmFWSP6SomyNaGIu/JjnqQPW8OZGIVfVYsY/RV+RdQkyK3Ptw9LhFCwlSIILJUdT9ZRePSh5Z6usOTlQ8plWuuk+waU540qVvSf4ai9l/OY9wYPBeL+XsvfS0TpTsLFdyXdHR5NBb+E5m8DZZthbO247Bava+G27MKuOiyz8VrMopds2G939Y9FJcJoJszV8w6+dZqMpDJsbWp9t16ZjxOCy7WjGHueyzSxNfJlZOcxxZTxz8nBYVvRhPKovHZYVHazHLL27jP2l+YCscpfQzv59M3irdLK3f5kabwnN9tPBpUwzZxkFiikkHINjpBKP3m5xB/tK6MA5ujze7n92DXEKNN1cJTVin7iXIH9cPSW0YdQEes/4BqaVpz74kgdh2P4GzpTN6KhcT9TXrmPMnaNyPhkdo1SZVLmu9FPOp4JXFX7Q2m71bqqv2sG3e0WDK4Z+Xvok0dqaqu9/N30woOOTktjHQGbkRLfH40twQC60QPXkgb+sD/SdfLjcvw934OnnQoO6jEaxydAQlXqsn8wBhLuF2G0dwdhfwDzN+bkf+Up8tFjEq7jG3cTxqedCo9ql6kC80BrH/pkfmZj91m3wQlsc6ZlbBWrmAzBqQhig0u9Zb3bwzOGXtt9S/AcRx/qJu4zMbk8TwdMVODZP3CoQqE9uDfhAeY+jfp4u4WEd+dEJpSSmcwclvkhSyxofCrQ42udtpSm4zxfbE2LJgON5uwx6l0pRBG8XYaSnbaVpyY9DbAnB8hrH03ZZsx+MT0i27L1BRptaSv6zqXqBv3MGJfzICvAoJPyBrTOo4DdWo2eNT7ckZ9DAI56Hnj3B4wVf0DFc2nMYzbI9Xj4uJ1ItjCmr+GXAJf5yZUFMZ5PD7Qf97icCRBV3BrM9a7VLwBQImlqkfGeN2q08/jHazfTXTcZTkZ7tobtMvUAU3uEGBneEdadAGERie7KpIiHUCuhkR92JHMK/uj0+hY/hZwzpMZ1oKlLhu9w3Bhy25vgk9V5cZeGXtaei/qLwXRaCb17jHSZrXEmd3x/EHUZHlopE+C7jSiCKEBQY4031kEDOt92xVLST7dnDXQaJ1yAkXSIK1vJLZVfOt92RVLTDBu5ytSI47NlQzXqv6gdnij+0pSI+0bsmpMkeBiyZBRay2SJyMtcpcHLk0QoR7nK1Ioj6IkO2stakx/63VlQk+eNIyNNLROEv1toOZeaUQlSIMd2QVDQCIwkAFyX6ohs7XEljHRk43/ZhdVglA/pky4xkpUAUnr0ZKtLwhTrMADBIKpow07Rwl0JTDz7jU5thII11JGO+bSCpSIFdpb4VnpOgV9Yq1YhhLyloxdxjJBUppfZgvgSaSm03+MDACg/SaHl61LdlqWiAPaXI5ItQV9Uo5Yia1qQBEkUDKpKy0RtCIY1UFNg7JSN0pBGiXTmX9EocjBohC0JwKROFT9yjsDOCzcj5tjVLRT4FwaVMFD6CCSAAR+MuKSjEU2ndGB5JVCcA7VKaLkh4Q000QU8a/1YH/LY0FelEfB0YjqiOBfFoVWTQAwksFW3TC1MdMkv/FGlY4xHLSFgqSgDfaYFTB+YB940NC2amR6FBBR1IJUtFOuD84xjlhZv41IsFBtIgNTsoNBXZwAuJ5TWH1EkwFsxPFLm7nkJleviVDxTiy50UlWMmSMcaNGiG3ss0FdGQz3WrqDlkFFODCg2MuznyVCQDvolrTeXK6ZG1iBVtsPBUJAOOqjeamkNo1jxwcYk4odNh4anILSZOjAYKFEt/yYL6iTiEf2DhqcilRTfg0VSVnxC6C5oux/ebLjvSY+GpSIbVwK0TiLIJ/siTqkJwIORgIlFFLuAGoCoDJ5oNn6yqX1pmReyesRBV5MJqIF3BAwd7lLIMoLIW6pqQeY1EFbnQOhBABw6lPSpt9H0Vp7YqMEQVuYA7kNBZ1CZGQyh8rBkQVeQC7kBC1/pxYoc81Ce/kaa2GjBEFbmAO5DQlchMjF4eeWvi90CAqaLRfGgj0U9XIWwCdgFl4JQQfYUSYKpo1E7zkJ0ATcbHJNS+oyrh3dSBYapolF6UnFGJQtsx+QAUyXYYESpyoYZFe2UiY2JIogpEjU4CTBWNloONAsofJ0lgPRVwFc86GV9gmCoaKyemmbeLaVNLlJAlPB9gmCrapIGztliPAtqwCPLVCIgrWkOaOdmsZ9Thi38s1jMipxMtwFTRZj28hxqsqI4F9D6HtD0iwFTRJj2+OM5rAKP/rAdbisiC7K+G3yE4Q6rIpMFRjvgpYNs5TJGWkO9hqkhtl7XmyZJkfKbUDqjh3CwEmCqabCfXECiw7eSmurubzG6T7Ui/CGyg7UgnSzMV9tx21hqXlkRlFtDQHuLhCTBV5PZDoLmV8KKw/RBMwS5gAaCKtmiZsrhmrqnazarJ2M24/dgoZDFETaEfG0y9fnnTMQJMFbn9PClkEUVhPO5Uy13KqZS7FFyi3IpJFAUpmOCTBZqgKuWAy4mBKiqx0ofig8Ia2U+gAfSxSSMlY6GqSDX0r4mygMmZ3iADo/OgSKjHzVSR3M+sXBYj44MMm/n0ukBBGkEx2jlQVaQaMmu5LFLGB6VE4PNF6DyoZbQDIqrI7qdcKoszTamf8kbbm3WZxYFGg4WqItVQk4SySAScqmDE50UXnXzKI9UKC0jFHtdbIPAmIcqSxJ+4oMAAK2W0+SZLdDLaWRNVZD+XJ0qtypZEdWyA6ZzzNw66VBoUoopsCqksjiizz0nCnZiPqHmtGOHbOYBCVZFrGNhIZTFFIepxclFez/vllpVG1gYKT0X+c/akspiiCPWc5dfoKJsCKGKVn9wSDFFFbka0Fcqy5BBRxRh8zxTszhoGLCwV+c9pRSVjU77/tpWFMShGiZUY7GkeaEnOB/arslS0+BzjBpRmEzlENZ+XY6fHDV1OpaF6Hat9Y0tCHoysAhO57VHN58GIfVFDi0tKBo3dTwANv1Q+MWLSujUoYV/LAZcX8nJkAxaOiibHidBLWGFIAeTv2KzZnSl2U+23Eds+VBICykInXGiKaGbJZgP4ZbTKs1aa79fU5jhDRLG3UAHJB5irGxVgHVa8pG8PhaKiyXG4VKjYsdJ5F5WnXrGpAXll7YmtoAEeRUWT49RpRN5NCuSeG4DFRBXa+vDghV0DEoaKNsdx1MFSK5hUTSlJiJqh4nXF2yHhqci2ZI4Bm0BQBh81IvDb0EkE43dYAVbiIIakogGHYwHL9kDOZ/iVqyRkt0PDyxlWQDgqMhzq7+4e5t96YbqGWAunxEcNmRe1X3EZGJqKfMtZDchgyosMAFnRDI1pM2q3+nJi7OYZBl5Fq+MsHGAKdoiYtMKeqwFOSYzaKxh4Fe0MXC7+CrRhglaHDptR6/FxQ0+081YZBEVFIw73avbQiKbVqrhWRago0OHdThxZZAxwFS2NY1XNGhvRnJU+pQDX5lKnVK6YqAQ2n3tJeoekoglLzRi0N1MBDtjOQamh6kAQ4KguwoZ9knarh+QbE1Q0c+C4JqWNH3IfGvUhgFgPhhGMG7OX7/fvdVROq5UMsIrGxgmttzyLD5SvdEWXhE3d9flkx+zl9nj8/nIMRBt4FQ19kJSXN6Gv20n1vQq4B9Xf2GU2EbPLwapY8IdaqNG6RLZg0J78qyxwp69eoQm01xUbUypqT7e+qAjYwkc7apKBYAe/AtYB6XfO8NhD4GOhKhr/nQINLrJplNeppBj6PtVZPdHVeTNzbfLvIQhHRWpOVKX2gMs7CjIPQXuTrTGDHtP89fGyAl6dOrBTu8GuipQi9woXR3a6d4Aw0PIGW/kkP91vGfqm2XBhTDCsIqoiqsb/pQgL13aAUN7ySzZD/kqVLSqxy1GRnRPV3XyHjBoHWvnT/BEBucp2ZWqSnCfQqar+TH3rU9GJriI8DQOI4svjLf+RY46Q9384pvvlBZII35se7+b79wjv4xLVmb4dJEZqKSpSc6KojG3AXQRYHqawPxrF9+M2QJJvJ8B6bMEqgj/AXyTTXm0+xin6EX5dekEQ4ubfafb4Hvv//gPmpz6q8t6KoRpdqLWel2Eg/5iHOmSLQTohlW8qlgdWQpqbYQeny/G4Pf6VKODfFFaFjsGWP8NJnYXzzbsG9u+bV+vh8H62flDfOBE/S7HgJuPpxjHOKvspjk/ZtuCH0JfNFzOR5Mmy0OEJ/g7fbuKfECotFLZ/p/Ks0s5GiNE+v99x3dncNn2xCiu3vHB7tnbPR5Knt7sqpV59VmmnekrMrvoZiJmN1IWdCcdjMnGqZ2Wb2iZrLhyPr1bXxVz96Kt58bOVuMKlgeB33n50ej/1NaVaaM12MwBjgqkGRubXNt85h1ld5tNhnJ1INQWLqszK+xrArKe7abIJxQxs06smpzBHVoto98XDzGJJWJz2Ocnm3qONJuiZz9VuplI5Nc9bzcbRxNZG59nKJr+y8hQzdTS0gdU5zFe2rDAVAK3n57f7yP/czVk2IEWCCrOSUiK9+7Q2zkUgThIgbNU3N5LRrwcunWajoE4z4xeN5Hn645J/5OMlzEekqprRi07yXO04Xi6X2+U0M7+M+TGqZvCiluyodyulmy0s7cptL9oNlNSRN65Urt214r/u7fdxfALrOTUknQPilV86cI3tc619ob7s8tanr4nyQyHyMCCs5n5cIVp3H26QMj6/rfQHHH/dsX2/QYrAffvSYD+OL9vwrTe3P/d4dE142GK637EPDfLbZPQ9tb56+z3OwvqQ86oT2sBD3PxmbYFuPL5LVzr89+LNDO88+J6l3buPUDHF4Ft99t8uk/u8KpD2f+Tg6mMwpS0uPMbov+V/80BceXLqTZkv/y4IqP+G/D8s+HPmLw6d2YtLZ+7i1Jm5uHV+/stcNrVE1zB2Zv7n09emZFRrElZBi5uPwr3sct8edcNxWnlzUrdjwLaD+Bsg8ueHdfrY0XtGtNpy9x83TdOHldOn8ijZkb43DfL7jsvle5uT+8fl8hJWfw+m7WG7Xf3tmBb/Wfxn8Z/Ffxb/Wfxn8Z/Ffxb/Wfxn8Z/Ffxb/Wfznf/FYAQA="; // Replace this with your actual base64 string

const Result = () => {
  const navigate = useNavigate();
  const { score, resetQuiz, totalQuestions } = useQuiz();
  const [showForm, setShowForm] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    phone: '',
    email: '',
  });
  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [showConfetti, setShowConfetti] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    const timer = setTimeout(() => setShowConfetti(false), 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      await generatePDF();
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCertificateId = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CERT-${timestamp.slice(-6)}-${random}`;
  };

  const generatePDF = async () => {
    try {
      console.log('Creating PDF document...');
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([842, 595]);

      // Helper function to center text
      const centerText = (text: string, font: any, size: number) => {
        const { width } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, size);
        return (width - textWidth) / 2;
      };

      // Handle logo conversion
      console.log('Processing logo...');
      let logoImage;
      let logoDims;
      try {
        // Remove data URL prefix and get only the base64 part
        const base64Data = LOGO_BASE64.replace(/^data:image\/(png|webp|jpeg|jpg);base64,/, '');
        const binaryString = window.atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // For webp images, we need to convert to PNG first
        if (LOGO_BASE64.includes('data:image/webp')) {
          // Create a temporary canvas to convert WebP to PNG
          const img = new Image();
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          await new Promise((resolve, reject) => {
            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx?.drawImage(img, 0, 0);
              
              // Convert to PNG base64
              const pngBase64 = canvas.toDataURL('image/png').split(',')[1];
              const pngBinaryString = window.atob(pngBase64);
              const pngBytes = new Uint8Array(pngBinaryString.length);
              for (let i = 0; i < pngBinaryString.length; i++) {
                pngBytes[i] = pngBinaryString.charCodeAt(i);
              }
              resolve(pngBytes);
            };
            img.onerror = reject;
            img.src = LOGO_BASE64;
          }).then(async (pngBytes: Uint8Array) => {
            logoImage = await pdfDoc.embedPng(pngBytes);
            logoDims = logoImage.scale(0.5);
          });
        } else {
          // For PNG images, embed directly
          logoImage = await pdfDoc.embedPng(bytes);
          logoDims = logoImage.scale(0.5);
        }
        
        console.log('Logo processed successfully');
      } catch (logoError) {
        console.error('Error processing logo:', logoError);
      }

      // Embed fonts
      console.log('Embedding fonts...');
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const timesRomanItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

      const { width, height } = page.getSize();
      const certId = generateCertificateId();

      // Draw certificate content
      console.log('Drawing certificate content...');
      
      // Background with gradient effect
      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(0.98, 0.98, 1),
      });

      // Add decorative pattern
      for (let i = 0; i < width; i += 40) {
        page.drawLine({
          start: { x: i, y: 0 },
          end: { x: i + 20, y: 0 },
          thickness: 0.5,
          color: rgb(0.85, 0.85, 0.9),
        });
      }

      // Main border
      const borderMargin = 30;
      page.drawRectangle({
        x: borderMargin,
        y: borderMargin,
        width: width - 2 * borderMargin,
        height: height - 2 * borderMargin,
        borderColor: rgb(0.1, 0.4, 0.7),
        borderWidth: 2,
        color: rgb(1, 1, 1),
        opacity: 0,
      });

      // Draw logo only if it was successfully processed
      if (logoImage && logoDims) {
        const logoWidth = 120; // Set a fixed width for the logo
        const aspectRatio = logoDims.height / logoDims.width;
        const logoHeight = logoWidth * aspectRatio;
        
        page.drawImage(logoImage, {
          x: (width - logoWidth) / 2, // Center horizontally
          y: height - 120, // Increased the margin from top (was 100, now 80)
          width: logoWidth,
          height: logoHeight,
        });
      }

      // Title - adjust position accordingly
      const titleText = 'Certificate of Excellence';
      page.drawText(titleText, {
        x: centerText(titleText, helveticaBold, 40),
        y: height - 160, // Adjusted to match new logo position (was 180)
        size: 40,
        font: helveticaBold,
        color: rgb(0.1, 0.4, 0.7),
      });

      // Decorative lines - adjust accordingly
      const lineWidth = 300;
      page.drawLine({
        start: { x: (width - lineWidth) / 2, y: height - 180 }, // Adjusted (was 200)
        end: { x: (width + lineWidth) / 2, y: height - 180 },   // Adjusted (was 200)
        thickness: 2,
        color: rgb(0.1, 0.4, 0.7),
      });

      page.drawLine({
        start: { x: (width - lineWidth + 40) / 2, y: height - 185 }, // Adjusted (was 205)
        end: { x: (width + lineWidth - 40) / 2, y: height - 185 },   // Adjusted (was 205)
        thickness: 1,
        color: rgb(0.1, 0.4, 0.7),
      });

      // Certificate text
      const certifyText = 'This is to certify that';
      page.drawText(certifyText, {
        x: centerText(certifyText, timesRomanItalic, 18),
        y: height - 300,
        size: 18,
        font: timesRomanItalic,
        color: rgb(0.3, 0.3, 0.3),
      });

      // Recipient Name
      page.drawText(userDetails.name, {
        x: centerText(userDetails.name, helveticaBold, 36),
        y: height - 350,
        size: 36,
        font: helveticaBold,
        color: rgb(0.1, 0.4, 0.7),
      });

      // Achievement text with better formatting
      const achievementText = 'has successfully completed';
      page.drawText(achievementText, {
        x: centerText(achievementText, helveticaFont, 18),
        y: height - 390,
        size: 18,
        font: helveticaFont,
        color: rgb(0.3, 0.3, 0.3),
      });

      const quizText = 'The Data Science Assessment Quiz';
      page.drawText(quizText, {
        x: centerText(quizText, helveticaBold, 24),
        y: height - 420,
        size: 24,
        font: helveticaBold,
        color: rgb(0.1, 0.4, 0.7),
      });

      

      // Signature section with improved design
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Left side - Date
      const dateSection = {
        x: width * 0.25,
        lineWidth: 200,
      };

      page.drawLine({
        start: { x: dateSection.x - dateSection.lineWidth/2, y: 150 },
        end: { x: dateSection.x + dateSection.lineWidth/2, y: 150 },
        thickness: 1,
        color: rgb(0.1, 0.4, 0.7),
      });

      page.drawText('Date of Issue', {
        x: dateSection.x - helveticaFont.widthOfTextAtSize('Date of Issue', 12)/2,
        y: 130,
        size: 12,
        font: helveticaFont,
        color: rgb(0.5, 0.5, 0.5),
      });

      page.drawText(date, {
        x: dateSection.x - helveticaFont.widthOfTextAtSize(date, 14)/2,
        y: 110,
        size: 14,
        font: helveticaBold,
        color: rgb(0.3, 0.3, 0.3),
      });

      // Right side - Signature
      const signatureSection = {
        x: width * 0.75,
        lineWidth: 200,
      };

      page.drawLine({
        start: { x: signatureSection.x - signatureSection.lineWidth/2, y: 150 },
        end: { x: signatureSection.x + signatureSection.lineWidth/2, y: 150 },
        thickness: 1,
        color: rgb(0.1, 0.4, 0.7),
      });

      page.drawText('Program Director', {
        x: signatureSection.x - helveticaFont.widthOfTextAtSize('Program Director', 12)/2,
        y: 130,
        size: 12,
        font: helveticaFont,
        color: rgb(0.5, 0.5, 0.5),
      });

      page.drawText('John Smith', {
        x: signatureSection.x - helveticaBold.widthOfTextAtSize('John Smith', 14)/2,
        y: 110,
        size: 14,
        font: helveticaBold,
        color: rgb(0.3, 0.3, 0.3),
      });

      // Generate and download PDF
      console.log('Generating final PDF...');
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${userDetails.name.replace(/\s+/g, '_')}_certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('Certificate generated and downloaded successfully');
      resetQuiz();
      navigate('/');
    } catch (error: unknown) {
      console.error('Detailed error in PDF generation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error generating certificate: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-4 md:p-8">
      {showConfetti && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={true}
          numberOfPieces={200}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-4xl mx-auto"
      >
        {!showForm ? (
          <div className="text-center">
            <Trophy className="w-16 h-16 md:w-20 md:h-20 mx-auto text-yellow-500 mb-4 md:mb-6" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
              Congratulations! You've Passed the Quiz 🎉
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 md:mb-8">
              You scored {score} out of {totalQuestions}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Your Certificate
            </motion.button>
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
                Enter Your Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    value={userDetails.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUserDetails({ ...userDetails, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-medium">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={userDetails.phone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUserDetails({ ...userDetails, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-medium">Email</label>
                  <input
                    type="email"
                    required
                    value={userDetails.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUserDetails({ ...userDetails, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin">⌛</span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download Certificate
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Result;