module.exports = {
  "theme": {
    "extend": {
      "colors": {
        "Secondary": {
          "100": "#111729ff",
          "300": "#1e293bff",
          "400": "#334155ff",
          "500": "#677b8eff",
          "700": "#94a3b8ff"
        },
        "Gray": {
          "700": "#999999",
          "900": "#c3c5c9ff",
          "White": "#FFFFFF",
          "Black": "#000000"
        },
        "Pimary": {
          "300": "#0284c7ff",
          "500": "#4aa4e3ff",
          "700": "#c3e5faff",
          "800": "#e3e8efff",
          "900": "#f2f5f9ff"
        },
        "foreground": "#c3c5c9ff",
        "background": "#FFFFFF"
      },
      "spacing": {
        "threeunits": "48px",
        "TripleQuarter": "0.75rem",
        "DoubleUnit": "2rem",
        "Unit": "1rem",
        "FiveUnits": "5rem",
        "TripleUnit": "3rem",
        "HalfUnit": "0.5rem",
        "TwoAndHalf": "2.5rem",
        "UnitAndHalf": "1.5rem"
      },
      "borderRadius": {
        "Radius 4": "4px",
        "Round": "50%",
        "Radius25": "0.25rem",
        "Radius50": "0.5rem",
        "Radius75": "0.75rem"
      },
      "scale": {
        "Unit": "1rem",
        "HalfUnit": "0.5rem",
        "DoubleUnit": "2rem",
        "TripleUnit": "3rem"
      }
    }
  },
  "plugins": [],
  "content": [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./*.html"
  ]
}