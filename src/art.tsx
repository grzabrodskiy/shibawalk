import { CSSProperties, useId } from 'react';
import type {
  CarriedItem,
  CatCoat,
  Direction,
  DogCoat,
  OwnerHaircut,
  OwnerHeadwear,
  OwnerOutfit,
} from './game';

interface CharacterArtProps {
  facing?: Direction;
  moving?: boolean;
  rainy?: boolean;
  stride?: string;
  pullBack?: boolean;
  catCoat?: CatCoat;
  dogCoat?: DogCoat;
  ownerOutfit?: OwnerOutfit;
  ownerHaircut?: OwnerHaircut;
  ownerHeadwear?: OwnerHeadwear;
  carriedItem?: CarriedItem | null;
  sniffing?: boolean;
  hasCoffeeCup?: boolean;
  hasParcel?: boolean;
}

function directionalStyle(
  facing: Direction,
  stride: string,
  naturalFacing: Direction = 1,
): CSSProperties {
  return {
    transform: `scaleX(${facing === naturalFacing ? 1 : -1})`,
    ['--stride' as string]: stride,
  };
}

function getCatPalette(catCoat: CatCoat) {
  switch (catCoat) {
    case 'orangeTabby':
      return {
        furStart: '#e2ad72',
        furMid: '#c47d43',
        furEnd: '#925730',
        chestStart: '#f7e8d4',
        chestEnd: '#e7c9a7',
        stripe: '#8a4d28',
        stripeSoft: '#b56f3c',
        stripeOpacity: 0.58,
        stripeSoftOpacity: 0.34,
        earOuter: '#8f5732',
        tailAccent: '#efd7bc',
        legShadow: '#8d5b35',
        legMid: '#a36c42',
        paw: '#f3e2ce',
        shoulderStripe: '#794524',
        faceAccent: '#e3c5a8',
        muzzleLine: '#ead5be',
        whisker: '#f5e8dd',
      };
    case 'white':
      return {
        furStart: '#f7f3ee',
        furMid: '#e8e0d6',
        furEnd: '#cec3b7',
        chestStart: '#fffdfa',
        chestEnd: '#f1ebe3',
        stripe: '#b7aea4',
        stripeSoft: '#d4ccc2',
        stripeOpacity: 0.2,
        stripeSoftOpacity: 0.14,
        earOuter: '#b7ada2',
        tailAccent: '#ffffff',
        legShadow: '#d7cdc2',
        legMid: '#e6ddd4',
        paw: '#faf7f2',
        shoulderStripe: '#aaa095',
        faceAccent: '#d7cec5',
        muzzleLine: '#cdc3b9',
        whisker: '#b4aaa1',
      };
    case 'classic':
    default:
      return {
        furStart: '#827060',
        furMid: '#665749',
        furEnd: '#4a3e34',
        chestStart: '#e8ddd0',
        chestEnd: '#c8baa7',
        stripe: '#4b4038',
        stripeSoft: '#6a5a4d',
        stripeOpacity: 0.48,
        stripeSoftOpacity: 0.28,
        earOuter: '#5f5145',
        tailAccent: '#dac8b2',
        legShadow: '#584b41',
        legMid: '#6c5d52',
        paw: '#e7dacb',
        shoulderStripe: '#493d35',
        faceAccent: '#c7b39d',
        muzzleLine: '#d6c8b9',
        whisker: '#efe4d8',
      };
  }
}

function getDogPalette(dogCoat: DogCoat) {
  switch (dogCoat) {
    case 'charcoal':
      return {
        furStart: '#9398a0',
        furMid: '#6e737a',
        furEnd: '#4f545b',
        creamStart: '#ebe8e1',
        creamEnd: '#cbc6bd',
        darkStart: '#31353a',
        darkEnd: '#171a1d',
        backLeg: '#5c6168',
        frontLeg: '#737880',
        rearLeg: '#686d75',
        outerLeg: '#7d8289',
        bodyStripe: '#5c6168',
        bodyGlow: '#d9e0e7',
        muzzleLine: '#c7c1b7',
      };
    case 'cream':
      return {
        furStart: '#d8bf96',
        furMid: '#bb9b72',
        furEnd: '#94724f',
        creamStart: '#f4ebda',
        creamEnd: '#e2d3be',
        darkStart: '#4c392c',
        darkEnd: '#2b211a',
        backLeg: '#9f825f',
        frontLeg: '#b2926b',
        rearLeg: '#a98864',
        outerLeg: '#c2a074',
        bodyStripe: '#8f7253',
        bodyGlow: '#f6ead4',
        muzzleLine: '#d7b79c',
      };
    case 'shepherd':
      return {
        furStart: '#a38e70',
        furMid: '#735d46',
        furEnd: '#4a3b2d',
        creamStart: '#ddd0bc',
        creamEnd: '#c1ad92',
        darkStart: '#282320',
        darkEnd: '#12100f',
        backLeg: '#5f4f40',
        frontLeg: '#796653',
        rearLeg: '#6a5745',
        outerLeg: '#8e7760',
        bodyStripe: '#54463a',
        bodyGlow: '#d8cabc',
        muzzleLine: '#d1b79d',
      };
    case 'blackTan':
      return {
        furStart: '#695d54',
        furMid: '#433a34',
        furEnd: '#26211e',
        creamStart: '#dbc7b0',
        creamEnd: '#baa287',
        darkStart: '#1d1a19',
        darkEnd: '#090808',
        backLeg: '#473f39',
        frontLeg: '#5d534b',
        rearLeg: '#534840',
        outerLeg: '#6b5d53',
        bodyStripe: '#433c37',
        bodyGlow: '#d3c4b4',
        muzzleLine: '#c8a88d',
      };
    case 'mahogany':
      return {
        furStart: '#ab7655',
        furMid: '#7e4f35',
        furEnd: '#5a3223',
        creamStart: '#ecd9c1',
        creamEnd: '#d5b696',
        darkStart: '#45281d',
        darkEnd: '#21130e',
        backLeg: '#754b34',
        frontLeg: '#8d5a3e',
        rearLeg: '#805137',
        outerLeg: '#9f6547',
        bodyStripe: '#704631',
        bodyGlow: '#f1dec6',
        muzzleLine: '#ddb49a',
      };
    case 'sand':
    default:
      return {
        furStart: '#ab9278',
        furMid: '#836f5b',
        furEnd: '#625345',
        creamStart: '#ece1d2',
        creamEnd: '#d1c2af',
        darkStart: '#3d3835',
        darkEnd: '#231f1d',
        backLeg: '#6d6053',
        frontLeg: '#837363',
        rearLeg: '#736456',
        outerLeg: '#8f7c69',
        bodyStripe: '#5f5349',
        bodyGlow: '#efe0c8',
        muzzleLine: '#d6b59a',
      };
  }
}

function getOwnerPalette(ownerOutfit: OwnerOutfit) {
  switch (ownerOutfit) {
    case 'forest':
      return {
        backLeg: '#3f473d',
        frontLeg: '#566054',
        sleeve: '#6a816d',
        coat: '#6f876f',
        coatLine: '#8ead92',
        coatShade: '#4f6352',
      };
    case 'mustard':
      return {
        backLeg: '#564735',
        frontLeg: '#6d5943',
        sleeve: '#a48858',
        coat: '#ad915f',
        coatLine: '#d3bc80',
        coatShade: '#7c663e',
      };
    case 'berry':
      return {
        backLeg: '#473640',
        frontLeg: '#604852',
        sleeve: '#8c6274',
        coat: '#966a7b',
        coatLine: '#c093a5',
        coatShade: '#6d4b59',
      };
    case 'slate':
    default:
      return {
        backLeg: '#384454',
        frontLeg: '#495769',
        sleeve: '#6b7d8f',
        coat: '#698296',
        coatLine: '#88a0b0',
        coatShade: '#506274',
      };
  }
}

function renderOwnerHairBack(haircut: OwnerHaircut) {
  const hairFill = '#6d472f';
  const hairShadow = '#543321';

  switch (haircut) {
    case 'wavy':
      return (
        <g className="big-dog-handler__hair big-dog-handler__hair--wavy">
          <path
            d="M89 24C89 5 102 -12 120 -12C138 -12 151 3 151 24C151 39 146 51 138 60C131 55 123 52 116 52C108 52 100 55 94 60C90 50 89 39 89 24Z"
            fill={hairFill}
          />
          <path
            d="M95 42C98 49 102 54 107 59"
            fill="none"
            stroke={hairShadow}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M142 42C139 49 135 54 130 59"
            fill="none"
            stroke={hairShadow}
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>
      );
    case 'pixie':
      return (
        <g className="big-dog-handler__hair big-dog-handler__hair--pixie">
          <path
            d="M94 21C94 5 106 -9 121 -9C136 -9 147 3 147 18C147 28 142 37 136 42C130 39 124 38 119 38C113 38 108 40 102 43C97 39 94 31 94 21Z"
            fill={hairFill}
          />
        </g>
      );
    case 'ponytail':
      return (
        <g className="big-dog-handler__hair big-dog-handler__hair--ponytail">
          <path
            d="M92 21C92 4 105 -11 121 -11C136 -11 147 1 147 18C147 29 143 38 138 44C132 41 126 39 120 39C113 39 107 41 101 45C95 40 92 31 92 21Z"
            fill={hairFill}
          />
          <path
            d="M140 24C148 32 151 43 149 55C147 64 142 71 136 75"
            fill="none"
            stroke={hairFill}
            strokeWidth="7"
            strokeLinecap="round"
          />
        </g>
      );
    case 'bob':
    default:
      return (
        <g className="big-dog-handler__hair big-dog-handler__hair--bob">
          <path
            d="M90 24C90 5 103 -12 120 -12C137 -12 149 2 149 23C149 38 145 50 136 60C129 55 122 52 115 52C108 52 101 55 95 60C91 50 90 39 90 24Z"
            fill={hairFill}
          />
        </g>
      );
  }
}

function renderOwnerHairFront(haircut: OwnerHaircut) {
  const hairFill = '#6d472f';
  const hairShadow = '#543321';
  const hairHighlight = '#8b5b40';

  switch (haircut) {
    case 'wavy':
      return (
        <g className="big-dog-handler__fringe big-dog-handler__fringe--wavy">
          <path
            d="M94 22C95 7 106 -5 120 -6C134 -7 145 4 145 19C138 13 129 10 119 10C109 10 100 14 94 22Z"
            fill={hairFill}
          />
          <path
            d="M100 11C106 3 117 0 128 1C137 2 143 7 144 15C138 12 132 11 125 11C115 11 107 14 99 18C99 15 99 13 100 11Z"
            fill={hairHighlight}
          />
          <path
            d="M98 21C99 27 102 33 107 38"
            fill="none"
            stroke={hairShadow}
            strokeWidth="4.6"
            strokeLinecap="round"
          />
          <path
            d="M140 20C139 27 136 33 131 38"
            fill="none"
            stroke={hairShadow}
            strokeWidth="4.6"
            strokeLinecap="round"
          />
        </g>
      );
    case 'pixie':
      return (
        <g className="big-dog-handler__fringe big-dog-handler__fringe--pixie">
          <path
            d="M95 20C97 8 107 0 120 0C132 0 142 8 143 18C136 12 128 10 119 10C110 10 102 13 95 20Z"
            fill={hairFill}
          />
          <path
            d="M101 11C108 2 120 1 132 4C138 5 142 9 144 13C137 12 130 12 122 13C113 14 106 17 100 21C99 17 100 14 101 11Z"
            fill={hairHighlight}
          />
          <path
            d="M108 10C115 8 124 8 132 10"
            fill="none"
            stroke={hairShadow}
            strokeWidth="3.6"
            strokeLinecap="round"
          />
        </g>
      );
    case 'ponytail':
      return (
        <g className="big-dog-handler__fringe big-dog-handler__fringe--ponytail">
          <path
            d="M95 20C96 6 107 -5 120 -5C133 -5 144 5 145 19C138 13 129 10 120 10C110 10 101 14 95 20Z"
            fill={hairFill}
          />
          <path
            d="M100 11C106 3 117 0 128 1C137 2 143 7 145 15C139 11 132 10 124 10C115 10 107 13 100 18C99 15 99 13 100 11Z"
            fill={hairHighlight}
          />
          <path
            d="M129 10C131 15 132 22 131 29"
            fill="none"
            stroke={hairShadow}
            strokeWidth="3.8"
            strokeLinecap="round"
          />
        </g>
      );
    case 'bob':
    default:
      return (
        <g className="big-dog-handler__fringe big-dog-handler__fringe--bob">
          <path
            d="M95 21C96 6 107 -6 120 -7C134 -8 144 3 144 18C137 12 129 9 120 9C110 9 101 13 95 21Z"
            fill={hairFill}
          />
          <path
            d="M100 10C106 2 117 -1 128 0C137 1 143 6 144 14C138 11 130 10 122 10C113 10 105 13 99 17C99 14 99 12 100 10Z"
            fill={hairHighlight}
          />
          <path
            d="M98 19C99 26 101 33 105 39"
            fill="none"
            stroke={hairShadow}
            strokeWidth="4.4"
            strokeLinecap="round"
          />
          <path
            d="M140 19C139 26 136 33 131 39"
            fill="none"
            stroke={hairShadow}
            strokeWidth="4.4"
            strokeLinecap="round"
          />
        </g>
      );
  }
}

function renderOwnerHatBase(fill: string) {
  return (
    <path
      d="M94 19C97 6 108 -3 121 -3C134 -3 144 6 147 19C139 15 130 13 121 13C111 13 102 15 94 19Z"
      fill={fill}
    />
  );
}

function renderOwnerHeadwear(headwear: OwnerHeadwear, palette: ReturnType<typeof getOwnerPalette>) {
  switch (headwear) {
    case 'beanie':
      return (
        <g className="big-dog-handler__hat">
          {renderOwnerHatBase(palette.coatShade)}
          <path
            d="M92 14C95 -2 107 -14 121 -14C135 -14 147 -2 150 14C141 10 131 8 121 8C111 8 100 10 92 14Z"
            fill={palette.coatShade}
          />
          <rect x="94" y="13" width="54" height="11" rx="5.5" fill={palette.coatLine} />
          <circle cx="121" cy="-10" r="5" fill={palette.coatLine} />
        </g>
      );
    case 'baseballCap':
      return (
        <g className="big-dog-handler__hat">
          {renderOwnerHatBase(palette.coatShade)}
          <path
            d="M94 16C98 2 108 -7 121 -7C133 -7 143 1 147 13L147 21C139 17 129 15 120 15C110 15 101 17 94 21Z"
            fill={palette.coatShade}
          />
          <path
            d="M103 20C115 17 128 17 141 20C148 22 153 25 155 29C143 29 131 30 116 32C108 33 101 32 97 29C98 25 100 22 103 20Z"
            fill={palette.coatLine}
          />
        </g>
      );
    case 'beret':
      return (
        <g className="big-dog-handler__hat">
          {renderOwnerHatBase(palette.coatShade)}
          <ellipse cx="117" cy="6" rx="33" ry="16" fill={palette.coatShade} transform="rotate(-12 117 6)" />
          <ellipse cx="117" cy="9" rx="24" ry="10" fill={palette.coatLine} opacity="0.24" transform="rotate(-12 117 9)" />
          <path
            d="M112 -7C115 -12 121 -14 125 -11C123 -7 122 -3 122 1"
            fill="none"
            stroke={palette.coatLine}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      );
    case 'topHat':
      return (
        <g className="big-dog-handler__hat">
          {renderOwnerHatBase(palette.coatShade)}
          <ellipse cx="121" cy="1" rx="33" ry="7" fill={palette.coatShade} />
          <rect x="101" y="-35" width="40" height="38" rx="3" fill={palette.coatShade} />
          <rect x="105" y="-18" width="32" height="7" rx="2" fill={palette.coatLine} opacity="0.9" />
          <rect x="111" y="-31" width="20" height="14" rx="2" fill={palette.coatLine} opacity="0.22" />
        </g>
      );
    case 'none':
    default:
      return null;
  }
}

function renderWalkerCarryItem(carriedItem: CarriedItem | null) {
  switch (carriedItem) {
    case 'flowers':
      return (
        <g className="walker-flowers" transform="translate(82 -10)">
          <g transform="scale(1.1)">
            <path d="M55 191C63 177 72 164 82 150" fill="none" stroke="#5d8c54" strokeWidth="4.2" strokeLinecap="round" />
            <path d="M61 192C70 176 79 164 88 152" fill="none" stroke="#6da55f" strokeWidth="3.4" strokeLinecap="round" />
            <path d="M66 191L86 197L82 171Z" fill="#f1e2c8" opacity="0.92" />
            <circle cx="82" cy="150" r="8" fill="#f3c763" />
            <circle cx="74" cy="156" r="7" fill="#ef8aa1" />
            <circle cx="88" cy="158" r="7" fill="#ea6b6b" />
            <circle cx="90" cy="147" r="6" fill="#d586df" />
            <circle cx="79" cy="144" r="5" fill="#fff0cf" />
          </g>
        </g>
      );
    case 'coffee':
      return (
        <g className="walker-coffee" transform="translate(110 -4)">
          <g transform="scale(1.1)">
            <path d="M28 157C28 152 32 148 37 148H51C56 148 60 152 60 157V184C60 190 55 195 49 195H39C33 195 28 190 28 184V157Z" fill="#d7bea0" />
            <path d="M36 143H53C57 143 60 146 60 150V152H29V150C29 146 32 143 36 143Z" fill="#f3ece2" />
            <path d="M55 161C62 161 67 167 67 174C67 182 62 187 56 187" fill="none" stroke="#d7bea0" strokeWidth="5" strokeLinecap="round" />
            <path d="M33 163H55" fill="none" stroke="#b87b42" strokeWidth="4" strokeLinecap="round" opacity="0.68" />
          </g>
        </g>
      );
    case 'parcel':
      return (
        <g className="walker-parcel" transform="translate(78 2)">
          <g transform="scale(1.08)">
            <rect x="62" y="150" width="46" height="34" rx="6" fill="#d8b07a" />
            <rect x="64" y="154" width="42" height="30" rx="5" fill="#c79253" opacity="0.92" />
            <path d="M85 150V184" fill="none" stroke="#9d6637" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
            <path d="M62 167H108" fill="none" stroke="#9d6637" strokeWidth="4" strokeLinecap="round" opacity="0.72" />
            <path d="M62 150L85 137L108 150" fill="none" stroke="#e7c899" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
          </g>
        </g>
      );
    case 'takeout':
      return (
        <g className="walker-takeout" transform="translate(88 -2)">
          <g transform="scale(1.08)">
            <path d="M49 154C49 148 54 144 60 144H82C88 144 93 148 93 154V188C93 194 88 198 82 198H60C54 198 49 194 49 188V154Z" fill="#d7a566" />
            <path d="M57 145C57 138 62 132 69 132C76 132 81 138 81 145" fill="none" stroke="#9e5d30" strokeWidth="4.2" strokeLinecap="round" />
            <path d="M58 165H84" fill="none" stroke="#8c4b2e" strokeWidth="4" strokeLinecap="round" opacity="0.68" />
            <path d="M63 177H79" fill="none" stroke="#f6dfb3" strokeWidth="3.4" strokeLinecap="round" opacity="0.7" />
          </g>
        </g>
      );
    case 'petBag':
      return (
        <g className="walker-pet-bag" transform="translate(87 -2)">
          <g transform="scale(1.08)">
            <path d="M52 152C52 146 57 142 63 142H86C92 142 97 146 97 152V190C97 196 92 200 86 200H63C57 200 52 196 52 190V152Z" fill="#8cb7c8" />
            <path d="M61 144C61 136 66 130 74 130C81 130 87 136 87 144" fill="none" stroke="#567e93" strokeWidth="4.2" strokeLinecap="round" />
            <circle cx="74" cy="172" r="7" fill="#f6fbff" />
            <circle cx="67" cy="164" r="3.3" fill="#f6fbff" />
            <circle cx="81" cy="164" r="3.3" fill="#f6fbff" />
            <circle cx="74" cy="162" r="3.5" fill="#f6fbff" />
            <path d="M90 150C96 148 101 150 104 154" fill="none" stroke="#f0d18c" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M92 156L104 154L97 165" fill="#f0d18c" />
          </g>
        </g>
      );
    default:
      return null;
  }
}

export function WalkerArt({
  facing = 1,
  moving = true,
  rainy = false,
  stride = '0.72s',
  carriedItem = null,
  hasCoffeeCup = false,
  hasParcel = false,
}: CharacterArtProps) {
  const coatId = useId();
  const scarfId = useId();
  const skinId = useId();
  const activeCarryItem = carriedItem ?? (hasParcel ? 'parcel' : hasCoffeeCup ? 'coffee' : null);

  return (
    <svg
      className={`walker-art${moving ? ' is-moving' : ''}${rainy ? ' is-rainy' : ''}`}
      viewBox="0 0 210 360"
      role="img"
      aria-label="Person walking a dog"
      style={directionalStyle(facing, stride, 1)}
    >
      <defs>
        <linearGradient id={coatId} x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#314e68" />
          <stop offset="100%" stopColor="#183046" />
        </linearGradient>
        <linearGradient id={scarfId} x1="0%" x2="100%">
          <stop offset="0%" stopColor="#e2a360" />
          <stop offset="100%" stopColor="#c66a3d" />
        </linearGradient>
        <linearGradient id={skinId} x1="0%" x2="100%">
          <stop offset="0%" stopColor="#f2c8ab" />
          <stop offset="100%" stopColor="#d7a287" />
        </linearGradient>
      </defs>

      <g className="walker-shadow">
        <ellipse cx="102" cy="326" rx="48" ry="18" fill="rgba(24, 20, 18, 0.12)" />
      </g>

      <g className="walker-leg walker-leg--back">
        <path
          d="M90 184C82 226 79 270 80 321L100 321C106 282 111 250 117 220L90 184Z"
          fill="#303744"
        />
        <path d="M77 319H106C110 319 114 323 114 327V333H74V325C74 322 75 320 77 319Z" fill="#1f232c" />
      </g>

      <g className="walker-leg walker-leg--front">
        <path
          d="M121 184C131 226 138 271 141 321L161 321C163 280 160 242 151 204L121 184Z"
          fill="#46505d"
        />
        <path d="M137 319H166C171 319 174 323 174 327V333H134V325C134 322 135 320 137 319Z" fill="#1f232c" />
      </g>

      <g className="walker-arm walker-arm--back">
        <path
          d="M79 120C60 149 49 169 48 190C48 201 54 208 63 208C71 208 77 202 79 194C83 175 90 157 106 137L79 120Z"
          fill={`url(#${coatId})`}
        />
        <path
          d="M49 188C45 193 45 200 47 205C49 210 54 213 59 213C64 213 68 209 69 203C70 197 67 191 62 188C58 185 52 185 49 188Z"
          fill={`url(#${skinId})`}
        />
      </g>

      <g className="walker-body">
        <path
          d="M91 83C80 97 72 122 72 148L77 228C91 240 141 240 155 228L160 148C160 123 153 98 142 83C136 79 127 77 117 77C107 77 98 79 91 83Z"
          fill={`url(#${coatId})`}
        />
        <path d="M91 98C101 90 127 89 142 96" fill="none" stroke="#5c7c95" strokeWidth="6.2" strokeLinecap="round" />
        <path d="M84 146C99 155 118 156 148 145" fill="none" stroke="#234058" strokeWidth="6.4" strokeLinecap="round" opacity="0.42" />
        <path
          d="M77 176C91 185 132 186 154 176L155 228C141 240 91 240 77 228L75 198V176Z"
          fill={`url(#${coatId})`}
        />
        <path
          d="M84 178C96 185 132 185 149 178"
          fill="none"
          stroke="#1f384b"
          strokeWidth="5.4"
          strokeLinecap="round"
          opacity="0.58"
        />
        <path
          d="M94 179C96 191 101 203 107 215C101 222 94 226 85 228L80 205L84 181L94 179Z"
          fill="#254157"
          opacity="0.62"
        />
        <path
          d="M121 179C127 191 133 202 142 214C136 221 129 226 120 228L114 210L115 182L121 179Z"
          fill="#1d3449"
          opacity="0.58"
        />
        <path
          d="M92 90C100 81 122 79 141 86C139 96 131 103 120 104C107 105 97 100 92 90Z"
          fill={`url(#${scarfId})`}
        />
        <path
          d="M116 94C122 110 125 135 123 160C116 160 110 158 105 153C107 131 110 110 116 94Z"
          fill={`url(#${scarfId})`}
          opacity="0.94"
        />
        <path
          d="M114 89C118 87 124 87 128 89C127 96 123 100 118 100C114 100 112 96 114 89Z"
          fill="#bf6a3c"
          opacity="0.88"
        />
      </g>

      <g className="walker-arm walker-arm--front">
        <path
          d="M136 121C152 129 164 145 174 164C181 177 184 191 184 204C184 214 178 220 169 220C161 220 155 214 153 207L147 176L134 149L136 121Z"
          fill={`url(#${coatId})`}
        />
        {renderWalkerCarryItem(activeCarryItem)}
        <path d="M154 204C156 213 164 219 172 219C180 219 186 212 186 204C186 200 185 196 184 192L154 204Z" fill={`url(#${skinId})`} />
        <path d="M158 205C162 211 168 215 174 215" fill="none" stroke="#c68f74" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      </g>

      <g className="walker-head">
        <path d="M85 47C85 24 101 12 117 12C136 12 149 25 149 45C149 63 136 80 117 80C99 80 85 66 85 47Z" fill={`url(#${skinId})`} />
        <path
          d="M88 43C87 18 104 4 124 4C145 4 160 18 160 40C160 53 154 64 142 72C140 62 135 53 127 45C120 38 110 33 101 31C96 34 91 38 88 43Z"
          fill="#a14f1e"
        />
        <path d="M103 57C106 60 111 62 117 62C122 62 127 60 130 57" fill="none" stroke="#a56c57" strokeWidth="3.6" strokeLinecap="round" />
        <circle cx="106" cy="46" r="3.6" fill="#2a2a2a" />
        <circle cx="127" cy="46" r="3.6" fill="#2a2a2a" />
      </g>
    </svg>
  );
}

export function ShibaArt({
  facing = 1,
  moving = true,
  rainy = false,
  stride = '1.7s',
  pullBack = false,
}: CharacterArtProps) {
  const furId = useId();
  const furShadeId = useId();
  const creamId = useId();
  const collarId = useId();
  const earId = useId();
  const furLight = rainy ? '#d18a48' : '#f3a65a';
  const furMid = rainy ? '#bc7338' : '#df873d';
  const furDark = rainy ? '#8f4d24' : '#ac5828';
  const creamLight = rainy ? '#f4e3ca' : '#fff5e2';
  const creamMid = rainy ? '#e6c59b' : '#f1d3a7';
  const collarLight = rainy ? '#d46151' : '#f06f5f';
  const collarDark = rainy ? '#9e3028' : '#b53a30';

  return (
    <svg
      className={`shiba-art shiba-art--sprite${moving ? ' is-moving' : ''}${rainy ? ' is-rainy' : ''}${pullBack ? ' is-pull-back' : ''}`}
      viewBox="0 0 320 220"
      role="img"
      aria-label="Shiba inu"
      style={directionalStyle(facing, stride, -1)}
    >
      <defs>
        <linearGradient id={furId} x1="19%" x2="81%" y1="8%" y2="92%">
          <stop offset="0%" stopColor={furLight} />
          <stop offset="56%" stopColor={furMid} />
          <stop offset="100%" stopColor={furDark} />
        </linearGradient>
        <linearGradient id={furShadeId} x1="26%" x2="74%" y1="12%" y2="88%">
          <stop offset="0%" stopColor="#9b5128" />
          <stop offset="100%" stopColor="#6f3417" />
        </linearGradient>
        <linearGradient id={creamId} x1="18%" x2="82%" y1="16%" y2="84%">
          <stop offset="0%" stopColor={creamLight} />
          <stop offset="100%" stopColor={creamMid} />
        </linearGradient>
        <linearGradient id={collarId} x1="0%" x2="100%">
          <stop offset="0%" stopColor={collarLight} />
          <stop offset="100%" stopColor={collarDark} />
        </linearGradient>
        <linearGradient id={earId} x1="30%" x2="70%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#ffd6b2" />
          <stop offset="100%" stopColor="#f0b98f" />
        </linearGradient>
      </defs>

      <ellipse className="shiba-art__shadow" cx="168" cy="194" rx="78" ry="13" aria-hidden="true" />

      <g className="shiba-art__tail" aria-hidden="true">
        <path
          d="M248 112C278 74 299 110 279 127C266 138 245 133 246 118C247 105 262 101 271 110"
          fill="none"
          stroke={`url(#${furId})`}
          strokeWidth="26"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M251 111C266 91 282 106 270 119C262 127 250 123 252 115"
          fill="none"
          stroke="rgba(255, 244, 225, 0.62)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <g className="shiba-art__rear-leg" aria-hidden="true">
        <path
          d="M201 136C219 140 229 154 227 187H209C204 166 199 148 192 139Z"
          fill={`url(#${furShadeId})`}
        />
        <path
          d="M202 186H232C235 186 238 189 238 192V196H199V190C199 188 200 186 202 186Z"
          fill="#fff1dd"
        />
        <path
          d="M205 150C215 156 221 168 220 186"
          fill="none"
          stroke="rgba(255, 241, 220, 0.22)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      <g className="shiba-art__body" aria-hidden="true">
        <path
          d="M101 122C108 96 133 80 173 79C205 78 235 92 248 114C259 133 255 152 238 165C221 179 192 185 155 181C124 177 100 168 91 151C86 141 88 131 101 122Z"
          fill={`url(#${furId})`}
        />
        <path
          d="M122 127C132 144 154 157 186 159C206 160 223 156 235 145C231 165 206 179 170 179C135 179 109 166 98 145L122 127Z"
          fill={`url(#${creamId})`}
        />
        <path
          d="M122 100C147 92 192 92 228 110"
          fill="none"
          stroke="rgba(255, 226, 190, 0.34)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M174 80C208 81 236 97 247 119C252 128 253 137 250 144C238 130 219 122 193 119C158 115 131 123 108 138C97 131 95 120 102 109C113 91 139 80 174 80Z"
          fill="rgba(112, 53, 22, 0.18)"
        />
      </g>

      <g className="shiba-art__head" aria-hidden="true">
        <path d="M142 82L130 42L109 78Z" fill={`url(#${furId})`} />
        <path d="M111 83L93 46L80 87Z" fill={`url(#${furId})`} />
        <path d="M136 81L129 57L117 79Z" fill={`url(#${earId})`} opacity="0.9" />
        <path d="M107 82L98 58L89 82Z" fill={`url(#${earId})`} opacity="0.9" />
        <ellipse cx="113" cy="100" rx="39" ry="35" fill={`url(#${furId})`} />
        <ellipse cx="88" cy="112" rx="32" ry="23" fill={`url(#${furId})`} />
        <path
          d="M69 107C78 96 95 90 111 91C126 91 140 95 146 104C142 123 124 138 100 141C76 144 58 134 53 119C55 114 61 110 69 107Z"
          fill={`url(#${creamId})`}
        />
        <path
          d="M80 88C91 84 109 84 126 91"
          fill="none"
          stroke="rgba(255, 242, 226, 0.34)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="101" cy="100" r="4.6" fill="#231916" />
        <ellipse cx="67" cy="114" rx="10" ry="8" fill="#2b201b" />
        <circle cx="64" cy="112" r="2" fill="rgba(255, 255, 255, 0.45)" />
        <path
          d="M77 117C83 121 91 123 100 123"
          fill="none"
          stroke="#b4775e"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M82 128C89 132 97 133 106 131"
          fill="none"
          stroke="#a35636"
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        <circle cx="87" cy="107" r="3.2" fill="rgba(255, 255, 255, 0.26)" />
      </g>

      <g className="shiba-art__front-leg" aria-hidden="true">
        <path
          d="M151 136C169 141 179 155 177 188H159C154 166 149 148 142 139Z"
          fill={`url(#${furId})`}
        />
        <path
          d="M152 186H182C185 186 188 189 188 192V196H149V190C149 188 150 186 152 186Z"
          fill="#fff4e2"
        />
        <path
          d="M156 150C165 158 170 168 170 186"
          fill="none"
          stroke="rgba(255, 244, 230, 0.24)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      <g className="shiba-art__collar" aria-hidden="true">
        <path
          d="M133 98C126 101 121 106 118 114C124 118 132 121 140 123C149 124 157 123 164 119C161 111 154 104 145 100C142 99 138 98 133 98Z"
          fill={`url(#${collarId})`}
        />
      </g>

      <g className="shiba-art__ring" aria-hidden="true">
        <circle cx="122" cy="110" r="7" fill="rgba(255, 244, 213, 0.18)" stroke="#ba9154" strokeWidth="3.5" />
      </g>
    </svg>
  );
}

export function CatArt({
  facing = 1,
  moving = true,
  stride = '0.45s',
  catCoat = 'classic',
}: CharacterArtProps) {
  const furId = useId();
  const chestId = useId();
  const stripeId = useId();
  const palette = getCatPalette(catCoat);

  return (
    <svg
      className={`cat-art${moving ? ' is-moving' : ''}`}
      viewBox="0 0 260 160"
      role="img"
      aria-label="Cat running"
      style={directionalStyle(facing, stride, -1)}
    >
      <defs>
        <linearGradient id={furId} x1="8%" x2="100%" y1="12%" y2="92%">
          <stop offset="0%" stopColor={palette.furStart} />
          <stop offset="56%" stopColor={palette.furMid} />
          <stop offset="100%" stopColor={palette.furEnd} />
        </linearGradient>
        <linearGradient id={chestId} x1="0%" x2="100%" y1="10%" y2="90%">
          <stop offset="0%" stopColor={palette.chestStart} />
          <stop offset="100%" stopColor={palette.chestEnd} />
        </linearGradient>
        <linearGradient id={stripeId} x1="0%" x2="100%">
          <stop offset="0%" stopColor={palette.stripe} />
          <stop offset="100%" stopColor={palette.stripeSoft} />
        </linearGradient>
      </defs>

      <ellipse cx="142" cy="142" rx="70" ry="8.5" fill="rgba(27, 20, 16, 0.12)" />

      <g className="cat-tail">
        <path
          d="M210 84C224 64 235 39 233 21C232 12 225 9 220 12C215 15 214 23 217 32C220 43 221 57 214 78"
          fill="none"
          stroke={`url(#${furId})`}
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M212 82C221 67 228 47 227 31"
          fill="none"
          stroke={palette.tailAccent}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.34"
        />
      </g>

      <g className="cat-leg cat-leg--back">
        <path d="M175 95C181 106 184 118 184 132H173C171 119 169 107 166 97L175 95Z" fill={palette.legShadow} />
        <path d="M171 131H187C190 131 192 133 192 136V139H168V135C168 133 169 131 171 131Z" fill={palette.paw} />
      </g>
      <g className="cat-leg cat-leg--front">
        <path d="M111 95C114 108 113 120 111 133H100C99 119 100 108 103 96L111 95Z" fill={palette.legMid} />
        <path d="M99 132H115C118 132 120 134 120 137V140H96V136C96 134 97 132 99 132Z" fill={palette.paw} />
      </g>

      <g className="cat-body">
        <path
          d="M87 72C101 58 124 50 153 50C181 50 203 57 218 69C230 79 234 91 229 103C221 118 200 126 170 128C142 130 117 127 97 119C79 112 69 101 69 89C69 82 76 76 87 72Z"
          fill={`url(#${furId})`}
        />
        <path
          d="M98 96C106 112 124 120 148 122C171 124 191 119 206 107C199 123 181 131 155 133C129 134 108 128 94 112L98 96Z"
          fill={`url(#${chestId})`}
        />
        <path d="M107 67C127 61 157 63 186 76" fill="none" stroke={`url(#${stripeId})`} strokeWidth="5" strokeLinecap="round" opacity={palette.stripeOpacity} />
        <path d="M125 60C139 57 160 58 180 66" fill="none" stroke={palette.stripeSoft} strokeWidth="3.2" strokeLinecap="round" opacity={palette.stripeSoftOpacity} />
        <path d="M186 73C197 80 204 89 207 99" fill="none" stroke={palette.shoulderStripe} strokeWidth="5" strokeLinecap="round" opacity="0.4" />
      </g>

      <g className="cat-leg cat-leg--back">
        <path d="M154 96C156 109 154 121 150 133H139C140 120 143 108 147 97L154 96Z" fill={palette.legMid} />
        <path d="M138 132H154C157 132 159 134 159 137V140H135V136C135 134 136 132 138 132Z" fill={palette.paw} />
      </g>
      <g className="cat-leg cat-leg--front">
        <path d="M88 95C81 107 74 119 67 133H56C62 120 69 108 79 97L88 95Z" fill={palette.legShadow} />
        <path d="M55 132H71C74 132 76 134 76 137V140H52V136C52 134 53 132 55 132Z" fill={palette.paw} />
      </g>

      <g className="cat-head">
        <path
          d="M51 66C57 47 71 36 89 35C102 34 113 39 121 48C128 57 129 69 124 81C117 95 103 103 86 105C69 107 55 101 47 91C42 84 42 74 51 66Z"
          fill={`url(#${furId})`}
        />
        <path d="M59 54L70 27L79 53" fill={palette.earOuter} />
        <path d="M86 51L98 25L108 52" fill={palette.earOuter} />
        <path d="M57 73C62 87 73 95 87 95C101 95 112 88 118 74C114 95 103 104 87 105C71 106 59 96 57 73Z" fill={`url(#${chestId})`} />
        <path d="M73 53C80 49 93 49 104 55" fill="none" stroke={palette.faceAccent} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
        <circle cx="71" cy="66" r="2.8" fill="#181614" />
        <circle cx="95" cy="65" r="2.8" fill="#181614" />
        <path d="M82 71C85 71 87 73 87 75C87 78 85 80 82 80C79 80 77 78 77 75C77 73 79 71 82 71Z" fill="#2a241f" />
        <path d="M63 77C68 76 73 76 78 77" fill="none" stroke={palette.muzzleLine} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M87 77C92 76 97 76 102 77" fill="none" stroke={palette.muzzleLine} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M56 74C47 71 39 71 31 74" fill="none" stroke={palette.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M104 73C113 70 120 70 128 73" fill="none" stroke={palette.whisker} strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function PassingDogArt({
  facing = 1,
  moving = true,
  sniffing = false,
  stride = '0.7s',
  dogCoat = 'sand',
}: CharacterArtProps) {
  const furId = useId();
  const creamId = useId();
  const darkId = useId();
  const shadowId = useId();
  const palette = getDogPalette(dogCoat);

  return (
    <svg
      className={`passing-dog-art${moving ? ' is-moving' : ''}${sniffing ? ' is-sniffing' : ''}`}
      viewBox="0 0 300 190"
      role="img"
      aria-label="Passing dog"
      style={directionalStyle(facing, stride, -1)}
    >
      <defs>
        <linearGradient id={furId} x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor={palette.furStart} />
          <stop offset="54%" stopColor={palette.furMid} />
          <stop offset="100%" stopColor={palette.furEnd} />
        </linearGradient>
        <linearGradient id={creamId} x1="0%" x2="100%" y1="10%" y2="90%">
          <stop offset="0%" stopColor={palette.creamStart} />
          <stop offset="100%" stopColor={palette.creamEnd} />
        </linearGradient>
        <linearGradient id={darkId} x1="0%" x2="100%">
          <stop offset="0%" stopColor={palette.darkStart} />
          <stop offset="100%" stopColor={palette.darkEnd} />
        </linearGradient>
        <radialGradient id={shadowId} cx="46%" cy="38%" r="68%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.32)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      <ellipse cx="174" cy="163" rx="84" ry="11" fill="rgba(27, 20, 16, 0.12)" />

      <g className="dog-tail">
        <path
          d="M252 112C270 106 287 111 294 121C299 129 297 137 290 141C281 146 267 143 256 136C247 129 244 119 252 112"
          fill="none"
          stroke={`url(#${darkId})`}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <g className="dog-leg dog-leg--back">
        <path d="M232 111C237 126 239 140 236 156H224C223 141 220 126 217 114L232 111Z" fill={palette.backLeg} />
        <path d="M220 155H243C247 155 250 158 250 161V166H217V159C217 157 218 155 220 155Z" fill={`url(#${creamId})`} />
      </g>

      <g className="dog-leg dog-leg--front">
        <path d="M180 111C181 126 180 141 178 157H166C165 142 166 127 169 113L180 111Z" fill={palette.frontLeg} />
        <path d="M161 156H184C188 156 191 159 191 162V167H158V160C158 158 159 156 161 156Z" fill={`url(#${creamId})`} />
      </g>

      <g className="dog-body">
        <path
          d="M128 84C147 66 176 57 210 57C239 57 261 63 275 75C287 85 291 98 287 110C281 126 260 138 228 145C193 152 159 151 132 142C109 134 95 121 95 108C95 97 106 89 128 84Z"
          fill={`url(#${furId})`}
        />
        <path
          d="M138 82C157 67 183 62 214 62C237 63 256 68 269 76C259 77 247 81 234 89C220 98 206 105 187 109C170 112 154 111 143 104L135 93L138 82Z"
          fill={`url(#${darkId})`}
          opacity="0.9"
        />
        <ellipse cx="205" cy="99" rx="52" ry="26" fill={`url(#${shadowId})`} opacity="0.52" />
        <path
          d="M133 115C145 129 165 138 191 140C216 142 239 136 256 124C251 139 233 149 199 152C166 154 139 146 126 129L133 115Z"
          fill={`url(#${creamId})`}
        />
        <path d="M143 81C170 75 208 77 249 88" fill="none" stroke={palette.bodyStripe} strokeWidth="4.2" strokeLinecap="round" opacity="0.3" />
        <path d="M146 106C163 100 187 98 215 100" fill="none" stroke={palette.bodyGlow} strokeWidth="2.8" strokeLinecap="round" opacity="0.18" />
      </g>

      <g className="dog-leg dog-leg--back">
        <path d="M205 114C207 128 205 142 200 157H188C190 143 193 129 197 116L205 114Z" fill={palette.rearLeg} />
        <path d="M186 156H209C213 156 216 159 216 162V167H183V160C183 158 184 156 186 156Z" fill={`url(#${creamId})`} />
      </g>
      <g className="dog-leg dog-leg--front">
        <path d="M150 112C140 128 131 143 121 157H109C117 142 127 128 137 114L150 112Z" fill={palette.outerLeg} />
        <path d="M106 156H129C133 156 136 159 136 162V167H103V160C103 158 104 156 106 156Z" fill={`url(#${creamId})`} />
      </g>

      <g className="dog-head">
        <path
          d="M76 85C77 69 89 55 107 48C122 42 136 44 148 53C157 61 163 72 163 83C163 95 159 106 152 114C143 125 130 132 113 134C96 136 80 132 69 122C60 114 57 103 60 92Z"
          fill={`url(#${furId})`}
        />
        <path d="M110 56L121 27L132 56" fill={`url(#${darkId})`} />
        <path d="M132 60L147 34L157 63" fill={`url(#${darkId})`} />
        <path d="M106 60C114 50 126 49 136 54C143 59 146 68 143 78C137 89 127 96 113 99C106 91 102 71 106 60Z" fill={`url(#${darkId})`} opacity="0.78" />
        <path
          d="M61 92C51 86 48 77 53 68C58 60 69 56 81 56C91 57 99 62 103 71C107 79 106 88 102 96C96 105 84 111 71 111C66 107 63 101 61 92Z"
          fill={`url(#${creamId})`}
        />
        <path d="M74 102C82 116 96 124 114 124C128 124 140 120 149 112C145 128 132 137 113 139C92 140 75 129 69 109L74 102Z" fill={`url(#${creamId})`} />
        <circle cx="104" cy="80" r="3.2" fill="#1f1a18" />
        <path d="M52 81C59 81 64 85 64 90C64 96 59 100 52 100C46 100 40 96 40 90C40 85 46 81 52 81Z" fill="#241c18" />
        <path d="M62 95C70 97 79 97 88 95" fill="none" stroke="#b8a695" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M113 108C120 109 127 107 133 103" fill="none" stroke={palette.muzzleLine} strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function BigDogHandlerArt({
  moving = true,
  stride = '0.96s',
  ownerOutfit = 'slate',
  ownerHaircut = 'bob',
  ownerHeadwear = 'none',
}: Pick<CharacterArtProps, 'moving' | 'stride' | 'ownerOutfit' | 'ownerHaircut' | 'ownerHeadwear'>) {
  const palette = getOwnerPalette(ownerOutfit);

  return (
    <svg
      className={`big-dog-handler-art${moving ? ' is-moving' : ''}`}
      viewBox="0 -40 170 290"
      role="img"
      aria-label="Person leading a big dog"
      style={{ ['--stride' as string]: stride }}
    >
      <ellipse cx="88" cy="228" rx="34" ry="10" fill="rgba(27, 20, 16, 0.12)" />

      <g className="big-dog-handler__leg big-dog-handler__leg--back">
        <path d="M84 118C80 143 78 177 79 224H96C100 183 104 153 109 129L84 118Z" fill={palette.backLeg} />
        <path d="M75 222H99C103 222 106 225 106 229V234H72V227C72 224 73 222 75 222Z" fill="#1f2530" />
      </g>

      <g className="big-dog-handler__leg big-dog-handler__leg--front">
        <path d="M111 118C120 142 126 177 130 224H147C149 184 147 152 139 126L111 118Z" fill={palette.frontLeg} />
        <path d="M126 222H151C155 222 158 225 158 229V234H123V227C123 224 124 222 126 222Z" fill="#1f2530" />
      </g>

      <g className="big-dog-handler__arm big-dog-handler__arm--back">
        <path d="M92 72C80 90 73 105 72 120C72 128 77 133 84 133C90 133 95 128 96 122C99 108 106 96 117 83L92 72Z" fill={palette.sleeve} />
        <circle cx="75" cy="122" r="7" fill="#e3b398" />
      </g>

      <g className="big-dog-handler__body">
        <path d="M94 45C84 56 79 74 79 96L83 149C95 159 131 159 143 149L147 96C147 74 142 56 132 45C126 42 119 40 113 40C106 40 99 42 94 45Z" fill={palette.coat} />
        <path d="M95 57C104 49 121 49 133 55" fill="none" stroke={palette.coatLine} strokeWidth="5" strokeLinecap="round" />
        <path d="M88 112C101 119 121 120 139 113" fill="none" stroke={palette.coatShade} strokeWidth="5.6" strokeLinecap="round" opacity="0.45" />
        <path d="M102 48C108 41 124 40 136 46C132 54 124 58 115 58C107 58 101 55 102 48Z" fill="#d9b58d" />
        <path d="M97 50C107 41 124 41 136 48C132 37 123 30 112 30C103 30 96 37 97 50Z" fill="#7c5235" />
      </g>

      <g className="big-dog-handler__arm big-dog-handler__arm--lead">
        <path d="M131 75C118 83 107 96 98 111C93 120 92 128 96 133C100 138 107 139 113 136C119 133 121 127 122 121C124 109 131 98 142 89L131 75Z" fill={palette.coat} />
        <circle cx="99" cy="132" r="7" fill="#e3b398" />
      </g>

      <g className="big-dog-handler__head">
        {renderOwnerHairBack(ownerHaircut)}
        <path d="M93 21C93 4 105 -6 118 -6C132 -6 142 5 142 21C142 37 132 49 118 49C104 49 93 37 93 21Z" fill="#eac0a7" />
        {renderOwnerHairFront(ownerHaircut)}
        {renderOwnerHeadwear(ownerHeadwear, palette)}
        <circle cx="111" cy="20" r="2.8" fill="#211d1b" />
        <circle cx="126" cy="20" r="2.8" fill="#211d1b" />
        <path d="M113 31C116 32 121 32 124 31" fill="none" stroke="#b07b66" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}
