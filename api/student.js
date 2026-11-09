const fs = require("fs");
const path = require("path");

const BASE_URL =
  "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F";

const PHOTO_URLS = {
  "CSE|A": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtcs4%2FNU25A55.JPG",
  "CSE|B": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtcs4%2FNU25B55.JPG",
  "CSE|C": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtcs4%2FNU25C55.JPG",
  "CSE|D": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtcs4%2FNN25CSE228.JPG",
  "CSE|E": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtcs4%2FNN25CSE289.JPG",
  "CSE|F": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtcs4%2FNN25CSE392.JPG",
  "ISE|G": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtis4%2FNU25G18.JPG",
  "ISE|H": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtis4%2FNN25ISE045.JPG",
  "ISE|I": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtis4%2FNN25ISE038.JPG",
  "ISE|J": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtis4%2FNN25ISE007.JPG",
  "AIM|K": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtam4%2FNU25K15.JPG",
  "AIM|L": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtam4%2FNU25L15.JPG",
  "CYB|N": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtcy4%2FNU25N18.JPG",
  "CCE|O": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtcc4%2FNU25O18.JPG",
  "RAI|P": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtra4%2FNU25P18.JPG",
  "ECE|Q": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtec4%2FNU25Q15.JPG",
  "ECE|R": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtec4%2FNN25ECE075.JPG",
  "ECE|S": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtec4%2FNN25ECE170.JPG",
  "ACT|T": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtac4%2FNU25T19.JPG",
  "VDT|U": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtvl4%2FNU25U15.JPG",
  "EEE|V": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtee4%2FNN25EEE076.JPG",
  "EEE|W": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtee4%2FNN25EEE076.JPG",
  "BTY|X": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtbt4%2FNU25X55.JPG",
  "CIV|Y": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtcv4%2FNU25Y15.JPG",
  "MECH|Z1": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtme4%2FNU25Z115.JPG",
  "MECH|Z2": "https://university-student-photos.s3.ap-south-1.amazonaws.com/049/student_photos%2F1001%2Fbtme4%2FNU25Z215.JPG"
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function resolveStudent(usn) {
  const normalized = String(usn || "").trim().toUpperCase();

  if (!/^[A-Z0-9]{6,20}$/.test(normalized)) return null;

  if (normalized === "NNM24CS340" || normalized === "NNM24CS341" || normalized === "NNM24CS339") {
    return {
      usn: normalized,
      batch: "24",
      photoUrl: `https://sp.renenture.com/${normalized}.PNG`
    };
  }

  if (/^NNM24[A-Z]{2}\d{3}$/.test(normalized)) {
    return { usn: normalized, batch: "24", photoUrl: BASE_URL + encodeURIComponent(normalized) + ".JPG" };
  }

  if (/^NNM23[A-Z]{2}\d{3}$/.test(normalized)) {
    return { usn: normalized, batch: "23", photoUrl: BASE_URL + encodeURIComponent(normalized) + ".JPG" };
  }

  // Resolve 2025 USNs by matching the USN prefix against the sample filename
  // configured for each branch/section in the existing photo vault.
  for (const [key, sampleUrl] of Object.entries(PHOTO_URLS)) {
    const branch = key.split("|")[0];
    const section = key.split("|")[1];
    const encodedLastSeparator = sampleUrl.toLowerCase().lastIndexOf("%2f");
    const lastPart = encodedLastSeparator >= 0
      ? sampleUrl.slice(encodedLastSeparator + 3)
      : sampleUrl.slice(sampleUrl.lastIndexOf("/") + 1);
    const filename = decodeURIComponent(lastPart);
    const match = filename.match(/^(.*?)(\d+)(\.[^.]+)$/);
    if (!match) continue;

    const prefix = match[1];
    const extension = match[3];
    if (normalized.startsWith(prefix) && new RegExp("^" + prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\d+$").test(normalized)) {
      const encodedSeparator = sampleUrl.toLowerCase().lastIndexOf("%2f");
      const normalSeparator = sampleUrl.lastIndexOf("/");
      const splitAt = Math.max(encodedSeparator, normalSeparator);
      const separatorLength = splitAt === encodedSeparator && encodedSeparator > normalSeparator ? 3 : 1;
      const directory = sampleUrl.slice(0, splitAt + separatorLength);
      return {
        usn: normalized,
        batch: "25",
        branch,
        section,
        photoUrl: directory + encodeURIComponent(normalized) + extension
      };
    }
  }

  return null;
}

module.exports = (req, res) => {
  const usn = req.query.usn || "";
  const student = resolveStudent(usn);
  const indexPath = path.join(process.cwd(), "index.html");

  let html;
  try {
    html = fs.readFileSync(indexPath, "utf8");
  } catch (error) {
    res.status(500).send("Student Photo Vault could not load its index.html file.");
    return;
  }

  if (!student) {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(404);
    res.send(html);
    return;
  }

  const pageUrl = `https://sp.renenture.com/${student.usn.toLowerCase()}`;
  const imageUrl = student.photoUrl;
  const title = `${student.usn} | Student Photo Vault`;
  const description = `Student photograph for USN ${student.usn}.`;

  const dynamicMeta = `
<meta property="og:type" content="profile">
<meta property="og:site_name" content="Student Photo Vault">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${escapeHtml(pageUrl)}">
<meta property="og:image" content="${escapeHtml(imageUrl)}">
<meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}">
<meta property="og:image:alt" content="Student photograph for ${escapeHtml(student.usn)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${escapeHtml(imageUrl)}">
<script>window.__SHARED_STUDENT__ = ${JSON.stringify(student).replace(/</g, "\\u003c")};</script>`;

  // Replace the landing-page OG/Twitter tags with the student-specific values.
  html = html.replace(/<meta property="og:type"[^>]*>[\s\S]*?<meta name="twitter:image"[^>]*>/i, dynamicMeta);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.status(200).send(html);
};
