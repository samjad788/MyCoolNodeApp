var loadFont = false;
var googleFonts =
    'ABeeZee|Abel|Abhaya+Libre|Abril+Fatface|Aclonica|Acme|Actor|Adamina|Advent+Pro|Aguafina+Script|Akronim|Aladin|Alata|Alatsi|Aldrich|Alef|Alegreya|Alegreya+Sans|Alegreya+Sans+SC|Alegreya+SC|Aleo|Alex+Brush|Alfa+Slab+One|Alice|Alike|Alike+Angular|Allan|Allerta|Allerta+Stencil|Allura|Almarai|Almendra|Almendra+Display|Almendra+SC|Amarante|Amaranth|Amatic+SC|Amethysta|Amiko|Amiri|Amita|Anaheim|Andada|Andika|Angkor|Annie+Use+Your+Telescope|Anonymous+Pro|Antic|Antic+Didone|Antic+Slab|Anton|Arapey|Arbutus|Arbutus+Slab|Architects+Daughter|Archivo|Archivo+Black|Archivo+Narrow|Aref+Ruqaa|Arima+Madurai|Arimo|Arizonia|Armata|Arsenal|Artifika|Arvo|Arya|Asap|Asap+Condensed|Asar|Asset|Assistant|Astloch|Asul|Athiti|Atma|Atomic+Age|Aubrey|Audiowide|Autour+One|Average|Average+Sans|Averia+Gruesa+Libre|Averia+Libre|Averia+Sans+Libre|Averia+Serif+Libre|B612|B612+Mono|Bad+Script|Bahiana|Bahianita|Bai+Jamjuree|Baloo|Baloo+Bhai|Baloo+Bhaijaan|Baloo+Bhaina|Baloo+Chettan|Baloo+Da|Baloo+Paaji|Baloo+Tamma|Baloo+Tammudu|Baloo+Thambi|Balthazar|Bangers|Barlow|Barlow+Condensed|Barlow+Semi+Condensed|Barriecito|Barrio|Basic|Baskervville|Battambang|Baumans|Bayon|Be+Vietnam|Bebas+Neue|Belgrano|Bellefair|Belleza|BenchNine|Bentham|Berkshire+Swash|Beth+Ellen|Bevan|Big+Shoulders+Display|Big+Shoulders+Text|Bigelow+Rules|Bigshot+One|Bilbo|Bilbo+Swash+Caps|BioRhyme|BioRhyme+Expanded|Biryani|Bitter|Black+And+White+Picture|Black+Han+Sans|Black+Ops+One|Blinker|Bokor|Bonbon|Boogaloo|Bowlby+One|Bowlby+One+SC|Brawler|Bree+Serif|Bubblegum+Sans|Bubbler+One|Buda|Buenard|Bungee|Bungee+Hairline|Bungee+Inline|Bungee+Outline|Bungee+Shade|Butcherman|Butterfly+Kids|Cabin|Cabin+Condensed|Cabin+Sketch|Caesar+Dressing|Cagliostro|Cairo|Calistoga|Calligraffitti|Cambay|Cambo|Candal|Cantarell|Cantata+One|Cantora+One|Capriola|Cardo|Carme|Carrois+Gothic|Carrois+Gothic+SC|Carter+One|Catamaran|Caudex|Caveat|Caveat+Brush|Cedarville+Cursive|Ceviche+One|Chakra+Petch|Changa|Changa+One|Chango|Charm|Charmonman|Chathura|Chau+Philomene+One|Chela+One|Chelsea+Market|Chenla|Cherry+Cream+Soda|Cherry+Swash|Chewy|Chicle|Chilanka|Chivo|Chonburi|Cinzel|Cinzel+Decorative|Clicker+Script|Coda|Coda+Caption|Codystar|Coiny|Combo|Comfortaa|Coming+Soon|Concert+One|Condiment|Content|Contrail+One|Convergence|Cookie|Copse|Corben|Cormorant|Cormorant+Garamond|Cormorant+Infant|Cormorant+SC|Cormorant+Unicase|Cormorant+Upright|Courgette|Courier+Prime|Cousine|Coustard|Covered+By+Your+Grace|Crafty+Girls|Creepster|Crete+Round|Crimson+Pro|Crimson+Text|Croissant+One|Crushed|Cuprum|Cute+Font|Cutive|Cutive+Mono|Damion|Dancing+Script|Dangrek|Darker+Grotesque|David+Libre|Dawning+of+a+New+Day|Days+One|Dekko|Delius|Delius+Swash+Caps|Delius+Unicase|Della+Respira|Denk+One|Devonshire|Dhurjati|Didact+Gothic|Diplomata|Diplomata+SC|DM+Sans|DM+Serif+Display|DM+Serif+Text|Do+Hyeon|Dokdo|Domine|Donegal+One|Doppio+One|Dorsa|Dosis|Dr+Sugiyama|Duru+Sans|Dynalight|Eagle+Lake|East+Sea+Dokdo|Eater|EB+Garamond|Economica|Eczar|El+Messiri|Electrolize|Elsie|Elsie+Swash+Caps|Emblema+One|Emilys+Candy|Encode+Sans|Encode+Sans+Condensed|Encode+Sans+Expanded|Encode+Sans+Semi+Condensed|Encode+Sans+Semi+Expanded|Engagement|Englebert|Enriqueta|Erica+One|Esteban|Euphoria+Script|Ewert|Exo|Exo+2|Expletus+Sans|Fahkwang|Fanwood+Text|Farro|Farsan|Fascinate|Fascinate+Inline|Faster+One|Fasthand|Fauna+One|Faustina|Federant|Federo|Felipa|Fenix|Finger+Paint|Fira+Code|Fira+Mono|Fira+Sans|Fira+Sans+Condensed|Fira+Sans+Extra+Condensed|Fjalla+One|Fjord+One|Flamenco|Flavors|Fondamento|Fontdiner+Swanky|Forum|Francois+One|Frank+Ruhl+Libre|Freckle+Face|Fredericka+the+Great|Fredoka+One|Freehand|Fresca|Frijole|Fruktur|Fugaz+One|Gabriela|Gaegu|Gafata|Galada|Galdeano|Galindo|Gamja+Flower|Gayathri|Gelasio|Gentium+Basic|Gentium+Book+Basic|Geo|Geostar|Geostar+Fill|Germania+One|GFS+Didot|GFS+Neohellenic|Gidugu|Gilda+Display|Girassol|Give+You+Glory|Glass+Antiqua|Glegoo|Gloria+Hallelujah|Goblin+One|Gochi+Hand|Gorditas|Gothic+A1|Goudy+Bookletter+1911|Graduate|Grand+Hotel|Gravitas+One|Great+Vibes|Grenze|Griffy|Gruppo|Gudea|Gugi|Gupter|Gurajada|Habibi|Halant|Hammersmith+One|Hanalei|Hanalei+Fill|Handlee|Hanuman|Happy+Monkey|Harmattan|Headland+One|Heebo|Henny+Penny|Hepta+Slab|Herr+Von+Muellerhoff|Hi+Melody|Hind|Hind+Guntur|Hind+Madurai|Hind+Siliguri|Hind+Vadodara|Holtwood+One+SC|Homemade+Apple|Homenaje|Ibarra+Real+Nova|IBM+Plex+Mono|IBM+Plex+Sans|IBM+Plex+Sans+Condensed|IBM+Plex+Serif|Iceberg|Iceland|IM+Fell+Double+Pica|IM+Fell+Double+Pica+SC|IM+Fell+DW+Pica|IM+Fell+DW+Pica+SC|IM+Fell+English|IM+Fell+English+SC|IM+Fell+French+Canon|IM+Fell+French+Canon+SC|IM+Fell+Great+Primer|IM+Fell+Great+Primer+SC|Imprima|Inconsolata|Inder|Indie+Flower|Inika|Inknut+Antiqua|Inria+Serif|Irish+Grover|Istok+Web|Italiana|Italianno|Itim|Jacques+Francois|Jacques+Francois+Shadow|Jaldi|Jim+Nightshade|Jockey+One|Jolly+Lodger|Jomhuria|Jomolhari|Josefin+Sans|Josefin+Slab|Joti+One|Jua|Judson|Julee|Julius+Sans+One|Junge|Jura|Just+Another+Hand|Just+Me+Again+Down+Here|K2D|Kadwa|Kalam|Kameron|Kanit|Kantumruy|Karla|Karma|Katibeh|Kaushan+Script|Kavivanar|Kavoon|Kdam+Thmor|Keania+One|Kelly+Slab|Kenia|Khand|Khmer|Khula|Kirang+Haerang|Kite+One|Knewave|Kodchasan|KoHo|Kosugi|Kosugi+Maru|Kotta+One|Koulen|Kranky|Kreon|Kristi|Krona+One|Krub|Kulim+Park|Kumar+One|Kumar+One+Outline|Kurale|La+Belle+Aurore|Lacquer|Laila|Lakki+Reddy|Lalezar|Lancelot|Lateef|Lato|League+Script|Leckerli+One|Ledger|Lekton|Lemon|Lemonada|Lexend+Deca|Lexend+Exa|Lexend+Giga|Lexend+Mega|Lexend+Peta|Lexend+Tera|Lexend+Zetta|Libre+Barcode+128|Libre+Barcode+128+Text|Libre+Barcode+39|Libre+Barcode+39+Extended|Libre+Barcode+39+Extended+Text|Libre+Barcode+39+Text|Libre+Baskerville|Libre+Caslon+Display|Libre+Caslon+Text|Libre+Franklin|Life+Savers|Lilita+One|Lily+Script+One|Limelight|Linden+Hill|Literata|Liu+Jian+Mao+Cao|Livvic|Lobster|Lobster+Two|Londrina+Outline|Londrina+Shadow|Londrina+Sketch|Londrina+Solid|Long+Cang|Lora|Love+Ya+Like+A+Sister|Loved+by+the+King|Lovers+Quarrel|Luckiest+Guy|Lusitana|Lustria|M+PLUS+1p|M+PLUS+Rounded+1c|Ma+Shan+Zheng|Macondo|Macondo+Swash+Caps|Mada|Magra|Maiden+Orange|Maitree|Major+Mono+Display|Mako|Mali|Mallanna|Mandali|Manjari|Mansalva|Manuale|Marcellus|Marcellus+SC|Marck+Script|Margarine|Markazi+Text|Marko+One|Marmelad|Martel|Martel+Sans|Marvel|Mate|Mate+SC|Maven+Pro|McLaren|Meddon|MedievalSharp|Medula+One|Meera+Inimai|Megrim|Meie+Script|Merienda|Merienda+One|Merriweather|Merriweather+Sans|Metal|Metal+Mania|Metamorphous|Metrophobic|Michroma|Milonga|Miltonian|Miltonian+Tattoo|Mina|Miniver|Miriam+Libre|Mirza|Miss+Fajardose|Mitr|Modak|Modern+Antiqua|Mogra|Molengo|Molle|Monda|Monofett|Monoton|Monsieur+La+Doulaise|Montaga|Montez|Montserrat|Montserrat+Alternates|Montserrat+Subrayada|Moul|Moulpali|Mountains+of+Christmas|Mouse+Memoirs|Mr+Bedfort|Mr+Dafoe|Mr+De+Haviland|Mrs+Saint+Delafield|Mrs+Sheppards|Mukta|Mukta+Mahee|Mukta+Malar|Mukta+Vaani|Muli|Mystery+Quest|Nanum+Brush+Script|Nanum+Gothic|Nanum+Gothic+Coding|Nanum+Myeongjo|Nanum+Pen+Script|Neucha|Neuton|New+Rocker|News+Cycle|Niconne|Niramit|Nixie+One|Nobile|Nokora|Norican|Nosifer|Notable|Nothing+You+Could+Do|Noticia+Text|Noto+Sans|Noto+Sans+HK|Noto+Sans+JP|Noto+Sans+KR|Noto+Sans+SC|Noto+Sans+TC|Noto+Serif|Noto+Serif+JP|Noto+Serif+KR|Noto+Serif+SC|Noto+Serif+TC|Nova+Cut|Nova+Flat|Nova+Mono|Nova+Oval|Nova+Round|Nova+Script|Nova+Slim|Nova+Square|NTR|Numans|Nunito|Nunito+Sans|Odibee+Sans|Odor+Mean+Chey|Offside|Old+Standard+TT|Oldenburg|Oleo+Script|Oleo+Script+Swash+Caps|Open+Sans:300|Open+Sans|Open+Sans:600|Open+Sans:800|Open+Sans+Condensed:300|Oranienbaum|Orbitron|Oregano|Orienta|Original+Surfer|Oswald|Over+the+Rainbow|Overlock|Overlock+SC|Overpass|Overpass+Mono|Ovo|Oxygen|Oxygen+Mono|Pacifico|Padauk|Palanquin|Palanquin+Dark|Pangolin|Paprika|Parisienne|Passero+One|Passion+One|Pathway+Gothic+One|Patrick+Hand|Patrick+Hand+SC|Pattaya|Patua+One|Pavanam|Paytone+One|Peddana|Peralta|Permanent+Marker|Petit+Formal+Script|Petrona|Philosopher|Piedra|Pinyon+Script|Pirata+One|Plaster|Play|Playball|Playfair+Display|Playfair+Display+SC|Podkova|Poiret+One|Poller+One|Poly|Pompiere|Pontano+Sans|Poor+Story|Poppins|Port+Lligat+Sans|Port+Lligat+Slab|Pragati+Narrow|Prata|Preahvihear|Press+Start+2P|Pridi|Princess+Sofia|Prociono|Prompt|Prosto+One|Proza+Libre|PT+Mono|PT+Sans|PT+Sans+Caption|PT+Sans+Narrow|PT+Serif|PT+Serif+Caption|Public+Sans|Puritan|Purple+Purse|Quando|Quantico|Quattrocento|Quattrocento+Sans|Questrial|Quicksand|Quintessential|Qwigley|Racing+Sans+One|Radley|Rajdhani|Rakkas|Raleway|Raleway+Dots|Ramabhadra|Ramaraja|Rambla|Rammetto+One|Ranchers|Rancho|Ranga|Rasa|Rationale|Ravi+Prakash|Red+Hat+Display|Red+Hat+Text|Redressed|Reem+Kufi|Reenie+Beanie|Revalia|Rhodium+Libre|Ribeye|Ribeye+Marrow|Righteous|Risque|Roboto|Roboto+Condensed|Roboto+Mono|Roboto+Slab|Rochester|Rock+Salt|Rokkitt|Romanesco|Ropa+Sans|Rosario|Rosarivo|Rouge+Script|Rozha+One|Rubik|Rubik+Mono+One|Ruda|Rufina|Ruge+Boogie|Ruluko|Rum+Raisin|Ruslan+Display|Russo+One|Ruthie|Rye|Sacramento|Sahitya|Sail|Saira|Saira+Condensed|Saira+Extra+Condensed|Saira+Semi+Condensed|Saira+Stencil+One|Salsa|Sanchez|Sancreek|Sansita|Sarabun|Sarala|Sarina|Sarpanch|Satisfy|Sawarabi+Gothic|Sawarabi+Mincho|Scada|Scheherazade|Schoolbell|Scope+One|Seaweed+Script|Secular+One|Sedgwick+Ave|Sedgwick+Ave+Display|Sevillana|Seymour+One|Shadows+Into+Light|Shadows+Into+Light+Two|Shanti|Share|Share+Tech|Share+Tech+Mono|Shojumaru|Short+Stack|Shrikhand|Siemreap|Sigmar+One|Signika|Signika+Negative|Simonetta|Single+Day|Sintony|Sirin+Stencil|Six+Caps|Skranji|Slabo+13px|Slabo+27px|Slackey|Smokum|Smythe|Sniglet|Snippet|Snowburst+One|Sofadi+One|Sofia|Solway|Song+Myung|Sonsie+One|Sorts+Mill+Goudy|Source+Code+Pro|Source+Sans+Pro|Source+Serif+Pro|Space+Mono|Special+Elite|Spectral|Spectral+SC|Spicy+Rice|Spinnaker|Spirax|Squada+One|Sree+Krushnadevaraya|Sriracha|Srisakdi|Staatliches|Stalemate|Stalinist+One|Stardos+Stencil|Stint+Ultra+Condensed|Stint+Ultra+Expanded|Stoke|Strait|Stylish|Sue+Ellen+Francisco|Suez+One|Sulphur+Point|Sumana|Sunflower|Sunshiney|Supermercado+One|Sura|Suranna|Suravaram|Suwannaphum|Swanky+and+Moo+Moo|Syncopate|Tajawal|Tangerine|Taprom|Tauri|Taviraj|Teko|Telex|Tenali+Ramakrishna|Tenor+Sans|Text+Me+One|Thasadith|The+Girl+Next+Door|Tienne|Tillana|Timmana|Tinos|Titan+One|Titillium+Web|Tomorrow|Trade+Winds|Trirong|Trocchi|Trochut|Trykker|Tulpen+One|Turret+Road|Ubuntu|Ubuntu+Condensed|Ubuntu+Mono|Ultra|Uncial+Antiqua|Underdog|Unica+One|UnifrakturCook|UnifrakturMaguntia|Unkempt|Unlock|Unna|Vampiro+One|Varela|Varela+Round|Vast+Shadow|Vesper+Libre|Vibes|Vibur|Vidaloka|Viga|Voces|Volkhov|Vollkorn|Vollkorn+SC|Voltaire|VT323|Waiting+for+the+Sunrise|Wallpoet|Walter+Turncoat|Warnes|Wellfleet|Wendy+One|Wire+One|Work+Sans|Yanone+Kaffeesatz|Yantramanav|Yatra+One|Yellowtail|Yeon+Sung|Yeseva+One|Yesteryear|Yrsa|ZCOOL+KuaiLe|ZCOOL+QingKe+HuangYou|ZCOOL+XiaoWei|Zeyada|Zhi+Mang+Xing|Zilla+Slab|Zilla+Slab+Highlight'.split('|')

function getParams() {
    var url = window.location.href
        .slice(window.location.href.indexOf("?") + 1)
        .split("&");
    var result = {};
    url.forEach(function(item) {
        var param = item.split("=");
        result[param[0]] = param[1];
    });
    return result;
}

function init() {
    var surveyId = decodeURI(getParams()["id"]);
    var data = { surveyId: surveyId };
    $.ajax({
        type: 'POST',
        url: "survey/getTheme",
        data: data,
        success: function(theme) {
            Survey.dxSurveyService.serviceUrl = "";

            var css = {
                root: "sv_main sv_frame sv_default_css"
            };

            var model = new Survey.Model({ surveyId: surveyId, surveyPostId: surveyId });
            model.css = css;
            window.survey = model;
            model.render("surveyElement");
            model.onAfterRenderPage.add(function(result, options) {
                updateTheme(theme)
                setTimeout(updateTheme, 500, theme);
            });
        }
    });
}

function updateTheme(theme) {
    $(".sv_q_title").css("color", "#" + theme.q_textcolor);
    $(".sv_q_title").css("background", "#" + theme.q_backcolor);

    if (!loadFont) addFontLink(theme.q_font);
    var q_font = parseFont(theme.q_font);
    $('.sv_q_title').css({ fontFamily: "'" + q_font[0] + "'", fontWeight: q_font[1] });

    $("fieldset").css("color", "#" + theme.a_textcolor);

    $(".sv_q_matrix_dropdown").css("color", "#" + theme.a_textcolor);
    $(".sv_q_mt").css("color", "#" + theme.a_textcolor);

    $("fieldset table").css("color", "#" + theme.a_textcolor);
    if (!loadFont) addFontLink(theme.a_font);
    loadFont = true;
    var a_font = parseFont(theme.a_font)
    $('fieldset').css({ fontFamily: "'" + a_font[0] + "'", fontWeight: a_font[1] });
    $('fieldset table').css({ fontFamily: "'" + a_font[0] + "'", fontWeight: a_font[1] });
}

function parseFont(font) {
    font = font.replace(/\+/g, ' ');

    // Split font into family and weight
    font = font.split(':');

    var fontFamily = font[0];
    var fontWeight = font[1] || 400;

    return [fontFamily, fontWeight];
}

function addFontLink(font) {
    if (googleFonts.indexOf(font) > -1) {
        $('link:last').after('<link href="' + "https://fonts.googleapis.com/css?family=" + font + '" rel="stylesheet" type="text/css">');
    }
}
init();