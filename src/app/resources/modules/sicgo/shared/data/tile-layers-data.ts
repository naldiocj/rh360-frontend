// Criar estrutura tile-layers dentro de "config" em directorio de raíz
const ATRIBUTIONS_LIST = {
  CartoDb: '&copy; CESP &copy; <a href="https://piips/sicgo">SICGO</a>, DTTI KIVOVA © <a href="https://www.kivova.com/">2024</a></a>',
  CyclOSM:
    '&copy; CESP &copy; <a href="https://piips/sicgo">SICGO</a>, DTTI KIVOVA © <a href="https://www.kivova.com/">2024</a></a>',
  EsriWorldImagery:
  '&copy; CESP &copy; <a href="https://piips/sicgo">SICGO</a>, DTTI KIVOVA © <a href="https://www.kivova.com/">2024</a></a>',
  EsriWorldTopoMap:
  '&copy; CESP &copy; <a href="https://piips/sicgo">SICGO</a>, DTTI KIVOVA © <a href="https://www.kivova.com/">2024</a></a>',
  OSM: '&copy; CESP &copy; <a href="https://piips/sicgo">SICGO</a>, DTTI KIVOVA © <a href="https://www.kivova.com/">2024</a></a>',
  OSMHot:
  '&copy; CESP &copy; <a href="https://piips/sicgo">SICGO</a>, DTTI KIVOVA © <a href="https://www.kivova.com/">2024</a></a>',
  OpenTopo:
  '&copy; CESP &copy; <a href="https://piips/sicgo">SICGO</a>, DTTI KIVOVA © <a href="https://www.kivova.com/">2024</a></a>',
  StadiaKV:
    'CESP &copy; <a href="https://piips/sicgo">SICGO</a>, DTTI © <a href="https://www.kivova.com/">2024</a>',
  ThunderForest:
  '&copy; CESP &copy; <a href="https://piips/sicgo">SICGO</a>, DTTI KIVOVA © <a href="https://www.kivova.com/">2024</a></a>',
  USGS: 'Geologica </a>'
  };

const thunderForestKey = "apikey=<APIKEY>";
export const tileLayers = {
  baseLayers: {
    default: {
      map: "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      atribution: ATRIBUTIONS_LIST.OSM,
    },
    blackWhite: "http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",
    thunderForest: {
      map: {
        openCycleMap: `https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?${thunderForestKey}`,
        transport: `https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?${thunderForestKey}`,
        landscape: `https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?${thunderForestKey}`,
        outdoors: `https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?${thunderForestKey}`,
        transportDark: `https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?${thunderForestKey}`,
        spinalMap: `https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?${thunderForestKey}`,
        pioneer: `https://tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?${thunderForestKey}`,
        mobileAtlas: `https://tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?${thunderForestKey}`,
        neighbourhood: `https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?${thunderForestKey}`,
        atlas: `https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?${thunderForestKey}`,
      },
      atribution: ATRIBUTIONS_LIST.ThunderForest,
    },
    osmManik: {
      map: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      atribution: ATRIBUTIONS_LIST.OSM,
    },
    osmDE: {
      map: "https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png",
      atribution: ATRIBUTIONS_LIST.OSM,
    },
    osmHot: {
      map: "http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      atribution: ATRIBUTIONS_LIST.OSMHot,
    },
    openTopoMap: {
      map: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      atribution: ATRIBUTIONS_LIST.OpenTopo,
    },
    stadiakv: {
      map: {
        AlidadeSmooth:
          "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
        AlidadeSmoothDark:
          "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
        OsmBright:
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        Outdoors:
          "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      },
      atribution: ATRIBUTIONS_LIST.StadiaKV,
    },
    cycloOsm: {
      map: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
      atribution: ATRIBUTIONS_LIST.CyclOSM,
    },
    esri: {
      worldStreetMap: {
        map: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        atribution: ATRIBUTIONS_LIST.EsriWorldTopoMap
      }, 
      worldImagery: {
        map: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        atribution: ATRIBUTIONS_LIST.EsriWorldImagery
      } 
     
    },
    cartoDb: {
      map: {
        positron:
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      positronNoLabels:
        "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      voyager:
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      },
      atribution: ATRIBUTIONS_LIST.CartoDb
    },
    usgsUs: {
      map: {
        topo: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
      imagery:
        "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}",
      },
      atribution: ATRIBUTIONS_LIST.USGS
    },
    hikeBike: {
      map: "https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png",
      atribtuion: ATRIBUTIONS_LIST.OSM
    }
  }
};
