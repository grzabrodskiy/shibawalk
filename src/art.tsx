import { CSSProperties, useId } from 'react';
import type { Direction } from './game';

interface CharacterArtProps {
  facing?: Direction;
  moving?: boolean;
  rainy?: boolean;
  stride?: string;
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

export function WalkerArt({
  facing = 1,
  moving = true,
  rainy = false,
  stride = '0.72s',
  hasCoffeeCup = false,
  hasParcel = false,
}: CharacterArtProps) {
  const coatId = useId();
  const scarfId = useId();
  const skinId = useId();

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
        {hasCoffeeCup && (
          <g className="walker-coffee">
            <path d="M28 157C28 152 32 148 37 148H51C56 148 60 152 60 157V184C60 190 55 195 49 195H39C33 195 28 190 28 184V157Z" fill="#d7bea0" />
            <path d="M36 143H53C57 143 60 146 60 150V152H29V150C29 146 32 143 36 143Z" fill="#f3ece2" />
            <path d="M55 161C62 161 67 167 67 174C67 182 62 187 56 187" fill="none" stroke="#d7bea0" strokeWidth="5" strokeLinecap="round" />
            <path d="M33 163H55" fill="none" stroke="#b87b42" strokeWidth="4" strokeLinecap="round" opacity="0.68" />
          </g>
        )}
      </g>

      <g className="walker-body">
        <path
          d="M82 88C69 108 63 132 67 156L76 228C91 238 145 237 158 226L166 154C169 129 161 108 145 88H82Z"
          fill={`url(#${coatId})`}
        />
        <path d="M78 99C89 89 135 88 150 98" fill="none" stroke="#5c7c95" strokeWidth="8" strokeLinecap="round" />
        <path d="M78 144C98 156 118 157 154 143" fill="none" stroke="#234058" strokeWidth="8" strokeLinecap="round" opacity="0.45" />
        <path
          d="M72 176C88 187 136 188 160 176L158 226C145 237 91 238 76 228L72 197V176Z"
          fill={`url(#${coatId})`}
        />
        <path
          d="M80 178C94 186 135 186 153 178"
          fill="none"
          stroke="#1f384b"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.65"
        />
        <path
          d="M92 180C95 193 101 204 108 216C103 222 95 226 84 228L79 205L83 181L92 180Z"
          fill="#254157"
          opacity="0.75"
        />
        <path
          d="M123 180C129 192 136 202 146 213C141 221 132 226 121 228L114 210L116 183L123 180Z"
          fill="#1d3449"
          opacity="0.72"
        />
        <path d="M84 114H153L140 80H100L84 114Z" fill={`url(#${scarfId})`} />
        {hasParcel && (
          <g className="walker-parcel">
            <rect x="62" y="150" width="46" height="34" rx="6" fill="#d8b07a" />
            <rect x="64" y="154" width="42" height="30" rx="5" fill="#c79253" opacity="0.92" />
            <path d="M85 150V184" fill="none" stroke="#9d6637" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
            <path d="M62 167H108" fill="none" stroke="#9d6637" strokeWidth="4" strokeLinecap="round" opacity="0.72" />
            <path d="M62 150L85 137L108 150" fill="none" stroke="#e7c899" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
          </g>
        )}
      </g>

      <g className="walker-arm walker-arm--front">
        <path
          d="M136 121C153 129 165 145 176 164C183 177 186 191 186 204C186 214 179 220 170 220C162 220 156 214 154 207L148 176L134 149L136 121Z"
          fill={`url(#${coatId})`}
        />
        <path d="M155 204C157 213 165 219 173 219C182 219 188 212 188 204C188 200 187 196 186 192L155 204Z" fill={`url(#${skinId})`} />
        <path d="M159 205C163 211 170 215 176 215" fill="none" stroke="#c68f74" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      </g>

      <g className="walker-head">
        <path d="M84 46C84 23 101 12 117 12C136 12 149 26 149 45C149 63 136 79 117 79C99 79 84 65 84 46Z" fill={`url(#${skinId})`} />
        <path
          d="M88 42C87 17 104 4 124 4C145 4 160 18 160 40C160 52 154 63 142 70C138 50 124 34 101 31C96 34 91 38 88 42Z"
          fill="#a14f1e"
        />
        <path d="M103 56C106 59 111 61 117 61C123 61 128 59 130 56" fill="none" stroke="#a56c57" strokeWidth="4" strokeLinecap="round" />
        <circle cx="106" cy="46" r="3.8" fill="#2a2a2a" />
        <circle cx="127" cy="46" r="3.8" fill="#2a2a2a" />
      </g>
    </svg>
  );
}

export function ShibaArt({
  facing = 1,
  moving = true,
  rainy = false,
  stride = '0.6s',
}: CharacterArtProps) {
  const furId = useId();
  const creamId = useId();
  const shadowId = useId();

  return (
    <svg
      className={`shiba-art${moving ? ' is-moving' : ''}${rainy ? ' is-rainy' : ''}`}
      viewBox="0 0 280 200"
      role="img"
      aria-label="Shiba inu"
      style={directionalStyle(facing, stride, -1)}
    >
      <defs>
        <linearGradient id={furId} x1="0%" x2="100%" y1="10%" y2="100%">
          <stop offset="0%" stopColor="#d18a42" />
          <stop offset="55%" stopColor="#c76f2e" />
          <stop offset="100%" stopColor="#9c4c1b" />
        </linearGradient>
        <linearGradient id={creamId} x1="0%" x2="100%">
          <stop offset="0%" stopColor="#fff3da" />
          <stop offset="100%" stopColor="#f2d7b8" />
        </linearGradient>
        <radialGradient id={shadowId} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      <ellipse cx="148" cy="170" rx="82" ry="18" fill="rgba(30, 22, 16, 0.16)" />

      <g className="shiba-tail">
        <path
          d="M210 70C240 53 251 78 244 96C234 119 205 114 200 97C198 91 201 82 210 79C217 77 223 82 221 90C220 96 213 100 207 97"
          fill="none"
          stroke={`url(#${furId})`}
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <g className="shiba-body">
        <path
          d="M70 82C83 63 106 53 134 53C181 53 215 78 219 107C223 138 189 154 136 154C104 154 78 147 65 132C52 117 54 97 70 82Z"
          fill={`url(#${furId})`}
        />
        <ellipse cx="147" cy="101" rx="60" ry="39" fill={`url(#${shadowId})`} opacity="0.6" />
        <path
          d="M79 116C105 128 166 128 203 118C194 136 167 149 130 150C102 150 81 142 69 131L79 116Z"
          fill="#b25e24"
          opacity="0.75"
        />
        <path
          d="M81 115C91 132 110 145 136 146C166 147 189 137 203 120C194 149 168 165 131 165C99 165 73 150 65 132L81 115Z"
          fill={`url(#${creamId})`}
        />
        <ellipse
          cx="132"
          cy="97"
          rx="14"
          ry="18"
          transform="rotate(-18 132 97)"
          fill="none"
          stroke="#bf5636"
          strokeWidth="8"
        />
      </g>

      <g className="shiba-leg shiba-leg--back">
        <path d="M186 118C192 143 193 160 192 177H174C172 159 171 144 170 128L186 118Z" fill="#8f4316" />
        <path d="M170 176H196C200 176 204 179 204 183V187H167V180C167 178 168 177 170 176Z" fill="#fff2da" />
      </g>

      <g className="shiba-leg shiba-leg--rear">
        <path d="M166 119C171 142 171 160 169 177H151C149 158 149 145 149 129L166 119Z" fill="#9f4c1d" />
        <path d="M148 176H172C176 176 179 179 179 183V187H145V180C145 178 146 177 148 176Z" fill="#fff0d6" />
      </g>

      <g className="shiba-leg shiba-leg--middle">
        <path d="M146 123C149 145 150 160 149 177H131C129 158 129 146 128 130L146 123Z" fill="#a95621" />
        <path d="M127 176H152C156 176 159 179 159 183V187H124V180C124 178 125 177 127 176Z" fill="#fff2da" />
      </g>

      <g className="shiba-leg shiba-leg--front">
        <path d="M108 121C105 140 103 158 103 177H85C82 157 80 142 83 126L108 121Z" fill="#aa5d28" />
        <path d="M82 176H106C111 176 114 179 114 183V187H79V180C79 178 80 177 82 176Z" fill="#fff2da" />
      </g>

      <g className="shiba-head">
        <path
          d="M42 67C51 42 73 29 99 29C119 29 137 38 147 54C156 67 157 84 149 98C140 115 122 126 99 126C74 126 52 118 42 101C35 89 34 77 42 67Z"
          fill={`url(#${furId})`}
        />
        <path d="M56 53L75 28L91 56" fill="#9a4d1f" />
        <path d="M106 56L123 30L140 59" fill="#9a4d1f" />
        <path
          d="M58 88C65 103 79 111 98 111C116 111 130 103 136 88C130 108 115 123 98 123C78 123 63 109 58 88Z"
          fill={`url(#${creamId})`}
        />
        <path d="M82 88C88 92 94 94 99 94C104 94 111 92 116 88" fill="none" stroke="#d69b78" strokeWidth="4" strokeLinecap="round" />
        <circle cx="79" cy="77" r="4.2" fill="#1f1d1a" />
        <circle cx="116" cy="77" r="4.2" fill="#1f1d1a" />
        <path d="M98 82C102 82 106 85 106 89C106 92 102 95 98 95C94 95 90 92 90 89C90 85 94 82 98 82Z" fill="#2f241f" />
      </g>
    </svg>
  );
}

export function CatArt({ facing = 1, moving = true, stride = '0.45s' }: CharacterArtProps) {
  const furId = useId();
  const chestId = useId();

  return (
    <svg
      className={`cat-art${moving ? ' is-moving' : ''}`}
      viewBox="0 0 220 140"
      role="img"
      aria-label="Cat running"
      style={directionalStyle(facing, stride, -1)}
    >
      <defs>
        <linearGradient id={furId} x1="10%" x2="100%" y1="10%" y2="100%">
          <stop offset="0%" stopColor="#7d6653" />
          <stop offset="55%" stopColor="#6a5345" />
          <stop offset="100%" stopColor="#4f3b31" />
        </linearGradient>
        <linearGradient id={chestId} x1="0%" x2="100%">
          <stop offset="0%" stopColor="#e7d8c4" />
          <stop offset="100%" stopColor="#c9b7a0" />
        </linearGradient>
      </defs>

      <ellipse cx="118" cy="124" rx="58" ry="10" fill="rgba(27, 20, 16, 0.14)" />
      <path
        d="M174 78C184 56 189 33 184 17C181 8 172 5 166 10C161 14 160 23 163 31C167 42 168 56 161 74"
        fill="none"
        stroke={`url(#${furId})`}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g className="cat-leg cat-leg--back">
        <path d="M153 81C159 93 162 104 162 118H150C148 104 147 92 145 85L153 81Z" fill="#544137" />
        <path d="M148 117H165C168 117 171 119 171 122V125H145V121C145 119 146 117 148 117Z" fill="#d8c7b3" />
      </g>
      <g className="cat-leg cat-leg--front">
        <path d="M132 82C133 94 132 105 130 118H118C118 104 119 92 121 84L132 82Z" fill="#645045" />
        <path d="M117 117H134C137 117 140 119 140 122V125H114V121C114 119 115 117 117 117Z" fill="#dfcfba" />
      </g>

      <path
        d="M75 61C89 45 111 37 138 39C173 42 194 56 200 75C206 95 185 109 150 110C117 111 91 104 76 91C66 82 66 70 75 61Z"
        fill={`url(#${furId})`}
      />
      <path
        d="M88 83C95 96 109 103 127 106C145 108 162 105 177 95C171 111 155 118 133 119C111 120 93 113 81 99L88 83Z"
        fill={`url(#${chestId})`}
      />
      <path d="M100 63C118 58 148 60 176 74" fill="none" stroke="#8c7561" strokeWidth="5" strokeLinecap="round" opacity="0.5" />

      <g className="cat-leg cat-leg--back">
        <path d="M103 83C103 95 100 106 96 119H84C85 106 88 95 92 85L103 83Z" fill="#6a5549" />
        <path d="M83 118H100C103 118 106 120 106 123V126H80V122C80 120 81 118 83 118Z" fill="#e5d7c2" />
      </g>
      <g className="cat-leg cat-leg--front">
        <path d="M79 82C72 93 65 104 56 118H44C51 104 58 93 67 84L79 82Z" fill="#705a4d" />
        <path d="M43 117H60C63 117 66 119 66 122V125H40V121C40 119 41 117 43 117Z" fill="#eadcc7" />
      </g>

      <g className="cat-head">
        <path
          d="M39 58C45 39 60 28 80 28C95 28 109 34 117 46C125 58 126 72 119 84C111 98 95 105 78 105C58 105 43 97 36 84C31 76 31 66 39 58Z"
          fill={`url(#${furId})`}
        />
        <path d="M45 46L57 24L66 47" fill="#5e473b" />
        <path d="M75 43L88 22L98 48" fill="#5e473b" />
        <path d="M49 71C54 82 64 89 77 89C90 89 100 82 105 71C101 90 91 101 77 101C61 101 50 91 49 71Z" fill={`url(#${chestId})`} />
        <circle cx="59" cy="63" r="3.2" fill="#191715" />
        <circle cx="88" cy="62" r="3.2" fill="#191715" />
        <path d="M74 67C77 67 79 69 79 72C79 74 77 76 74 76C72 76 69 74 69 72C69 69 72 67 74 67Z" fill="#2c241f" />
        <path d="M53 73C59 72 64 72 69 73" fill="none" stroke="#d2c2ad" strokeWidth="2" strokeLinecap="round" />
        <path d="M80 73C85 72 91 72 97 73" fill="none" stroke="#d2c2ad" strokeWidth="2" strokeLinecap="round" />
        <path d="M45 69C36 66 30 66 23 69" fill="none" stroke="#efe7dc" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M103 68C112 65 118 65 126 68" fill="none" stroke="#efe7dc" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function PassingDogArt({
  facing = 1,
  moving = true,
  stride = '0.7s',
}: CharacterArtProps) {
  const furId = useId();
  const creamId = useId();
  const darkId = useId();
  const shadowId = useId();

  return (
    <svg
      className={`passing-dog-art${moving ? ' is-moving' : ''}`}
      viewBox="0 0 260 170"
      role="img"
      aria-label="Passing dog"
      style={directionalStyle(facing, stride, -1)}
    >
      <defs>
        <linearGradient id={furId} x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#d7a160" />
          <stop offset="52%" stopColor="#bc763e" />
          <stop offset="100%" stopColor="#86502a" />
        </linearGradient>
        <linearGradient id={creamId} x1="0%" x2="100%">
          <stop offset="0%" stopColor="#fff4e1" />
          <stop offset="100%" stopColor="#ecd0ad" />
        </linearGradient>
        <linearGradient id={darkId} x1="0%" x2="100%">
          <stop offset="0%" stopColor="#5f4030" />
          <stop offset="100%" stopColor="#39221a" />
        </linearGradient>
        <radialGradient id={shadowId} cx="46%" cy="38%" r="68%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.32)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      <ellipse cx="150" cy="149" rx="74" ry="12" fill="rgba(27, 20, 16, 0.12)" />

      <g className="dog-tail">
        <path
          d="M207 101C221 81 238 80 243 95C247 108 240 119 230 122C221 124 212 119 208 111C206 107 205 103 207 101"
          fill="none"
          stroke={`url(#${darkId})`}
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <g className="dog-leg dog-leg--back">
        <path d="M183 102C188 118 189 132 187 146H174C173 133 171 119 170 106L183 102Z" fill="#744122" />
        <path d="M167 145H192C196 145 199 148 199 151V155H164V149C164 147 165 145 167 145Z" fill={`url(#${creamId})`} />
      </g>

      <g className="dog-leg dog-leg--front">
        <path d="M160 102C161 117 161 132 159 146H146C145 131 146 118 149 106L160 102Z" fill="#8e542f" />
        <path d="M140 145H165C169 145 172 148 172 151V155H137V149C137 147 138 145 140 145Z" fill={`url(#${creamId})`} />
      </g>

      <g className="dog-body">
        <path
          d="M92 84C106 68 129 58 157 58C186 58 207 68 218 84C227 97 226 113 217 126C205 142 184 148 152 148C121 148 98 142 85 129C73 118 76 100 92 84Z"
          fill={`url(#${furId})`}
        />
        <path
          d="M104 82C121 68 146 63 172 65C192 67 206 73 215 83C207 81 199 81 191 83C179 86 169 92 158 99C148 105 136 109 123 109C114 109 108 106 103 100L100 92L104 82Z"
          fill={`url(#${darkId})`}
          opacity="0.88"
        />
        <ellipse cx="156" cy="96" rx="46" ry="27" fill={`url(#${shadowId})`} opacity="0.62" />
        <path
          d="M102 108C112 123 133 134 157 134C179 134 197 127 211 115C207 133 190 146 154 148C122 148 97 137 91 116L102 108Z"
          fill={`url(#${creamId})`}
        />
        <path d="M106 82C129 76 165 77 205 88" fill="none" stroke="#7b4728" strokeWidth="4.2" strokeLinecap="round" opacity="0.28" />
        <path d="M104 102C118 94 142 92 170 93" fill="none" stroke="#efc590" strokeWidth="3.4" strokeLinecap="round" opacity="0.28" />
      </g>

      <g className="dog-leg dog-leg--back">
        <path d="M130 108C131 122 129 135 125 146H112C113 133 115 120 118 111L130 108Z" fill="#8a4f2c" />
        <path d="M104 145H129C133 145 136 148 136 151V155H101V149C101 147 102 145 104 145Z" fill={`url(#${creamId})`} />
      </g>
      <g className="dog-leg dog-leg--front">
        <path d="M101 104C92 121 82 134 72 146H60C68 131 78 118 88 107L101 104Z" fill="#a36037" />
        <path d="M57 145H84C88 145 91 148 91 151V155H54V149C54 147 55 145 57 145Z" fill={`url(#${creamId})`} />
      </g>

      <g className="dog-head">
        <path
          d="M62 84C65 66 79 53 99 53C114 53 127 59 136 70C144 81 145 95 138 108C129 121 115 129 96 131C75 133 58 126 50 112C46 104 48 93 62 84Z"
          fill={`url(#${furId})`}
        />
        <path d="M96 57L104 32L115 57" fill={`url(#${darkId})`} />
        <path d="M117 60L128 38L138 65" fill={`url(#${darkId})`} />
        <path d="M94 59C100 48 112 47 121 53C128 58 130 67 126 77C121 88 112 95 99 99C91 91 89 71 94 59Z" fill={`url(#${darkId})`} opacity="0.7" />
        <path
          d="M47 88C40 79 40 69 46 61C52 54 63 52 74 54C83 56 89 62 92 70C94 79 91 89 84 97C75 106 62 110 51 107C48 104 47 99 47 88Z"
          fill={`url(#${creamId})`}
        />
        <path d="M63 98C71 111 84 120 100 121C114 122 126 117 135 107C131 124 118 133 100 133C80 133 65 121 60 103L63 98Z" fill={`url(#${creamId})`} />
        <circle cx="90" cy="78" r="3.5" fill="#1f1a18" />
        <path d="M45 77C51 77 56 81 56 86C56 91 51 95 45 95C39 95 34 91 34 86C34 81 39 77 45 77Z" fill="#241c18" />
        <path d="M53 92C60 94 68 94 76 92" fill="none" stroke="#b69b85" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M102 104C109 106 115 105 121 102" fill="none" stroke="#d09f79" strokeWidth="2.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}
