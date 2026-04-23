const config = {
  data: {
    // Main invitation title that appears on the page
    title: "Pernikahan Fuad & Kikit",
    // Opening message/description of the invitation
    description:
      "Kami akan menikah dan mengundang Anda untuk turut merayakan momen istimewa ini.", // Nanti ini dibikin random
    // Groom's name
    groomName: "Fuad",
    // Bride's name
    brideName: "Kikit",
    // Groom's parents names
    parentGroom: "Bapak Imam Rofii & Ibu Muthi'ah",
    // Bride's parents names
    parentBride: "Alm. Bapak Wahyu & Ibu Edah",
    // Wedding date (format: YYYY-MM-DD)
    date: "2026-06-13",
    // Google Maps link for location (short clickable link)
    maps_url: "https://goo.gl/maps/abcdef",
    // Google Maps embed code to display map on website
    // How to get: open Google Maps → select location → Share → Embed → copy link
    maps_embed:
      // "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0000000000005!2d106.8270733147699!3d-6.175392995514422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4f1b6d7b1e7%3A0x2e69f4f1b6d7b1e7!2sMonumen%20Nasional!5e0!3m2!1sid!2sid!4v1633666820004!5m2!1sid!2sid",
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.156544575283!2d107.5928966749972!3d-6.990835293010201!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e98d930b77d7%3A0x97da5230f519b26b!2sLumpia%20basah%20Let%27s%20GO!5e0!3m2!1sid!2sid!4v1774712047879!5m2!1sid!2sid",
    // Event time (free format, example: "10:00 - 12:00 WIB")
    time: "11:00 WIB - Selesai",
    // Venue/building name
    location: "Kediaman Mempelai Wanita",
    // Full address of the wedding venue
    address: "Gang Pa Ondo (Paling Ujung), Jl. Rancamanyar, Kec. Baleendah, Kab. Bandung",
    // Image that appears when link is shared on social media
    ogImage: "/images/og-image.jpg",
    // Icon that appears in browser tab
    favicon: "/images/favicon.ico",
    // List of event agenda/schedule
    agenda: [
      {
        // First event name
        title: "Akad Nikah",
        date: "2026-06-13",
        startTime: "08:00",
        endTime: "10:00",
      },
      {
        // Second event name
        title: "Acara Walimah",
        date: "2026-06-13",
        startTime: "10:00",
        endTime: "15:00",
      }
      // You can add more agenda items with the same format
    ],

    // Background music settings
    audio: {
      // Music file (choose one or replace with your own file)
      src: "/audio/bermuara.mp3", // or /audio/nature-sound.mp3
      // Music title to display
      title: "Bermuara", // or Nature Sound
      // Whether music plays automatically when website opens
      autoplay: true,
      // Whether music repeats continuously
      loop: true
    },

    // List of bank accounts for digital envelope/gifts
    banks: [
      {
        bank: "Dana / Gopay / Shopeepay / OVO",
        accountNumber: "082117650821",
        accountName: "NUR FUAD AZIZI",
      },
      {
        bank: "Bank Rakyat Indonesia (BRI)",
        accountNumber: "089501048741536",
        accountName: "NUR FUAD AZIZI",
      },
      {
        bank: "Bank Syariah Indonesia (BSI)",
        accountNumber: "7251433687",
        accountName: "KIKIT ELISA YUNIARTI",
      }
    ]
  }
};

export default config;
