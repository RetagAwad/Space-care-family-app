import {
  AstronautProfile,
  FamilyMessage,
  FamilyPhoto,
  FamilyUser,
  NotificationPrefs,
  SimpleMissionUpdate,
} from '../types';

export const DEMO_USER: FamilyUser = {
  id: 'fam-mama-01',
  name: 'Amina El-Masry',
  nameAr: 'ماما أمينة المصري',
  relation: 'Mother',
  relationAr: 'والدة رائد الفضاء',
  email: 'amina.family@spacecare.demo',
  isDemo: true,
};

export const DEMO_ASTRONAUT: AstronautProfile = {
  name: 'Tarek El-Masry',
  nameAr: 'طارق المصري',
  missionLabel: 'Space Station Mission · Day 42',
  missionLabelAr: 'رحلة المحطة الفضائية · اليوم 42',
  flightDay: 42,
  totalDays: 180,
  latestUpdateTitle: "Your loved one's latest update",
  latestUpdateTitleAr: 'آخر تحديث عن ابنك',
  latestUpdateText:
    'Everything looks steady in the latest approved update. Tarek slept well, finished his daily exercise, and sent his warm love to everyone at home.',
  latestUpdateTextAr:
    'كل حاجة تمام في آخر تحديث معتمد. طارق نام كويس، خلّص تمارينه اليومية، وبيسلّم عليكم كلكم في البيت.',
  latestUpdateTime: 'Updated Today · 2:10 PM',
  latestUpdateTimeAr: 'تم التحديث اليوم · 2:10 ظهراً',
  nextCallWindow: 'Next Family Video Call: Saturday at 7:00 PM',
  nextCallWindowAr: 'مكالمة الفيديو القادمة: يوم السبت الساعة 7:00 مساءً',
  avatarUrl: '/src/assets/images/astronaut_son_avatar_1794658380064.jpg',
  heroUrl: '/src/assets/images/mission_cupola_hero_1794656079673.jpg',
};

export const DEMO_MESSAGES: FamilyMessage[] = [
  {
    id: 'msg-1',
    sender: 'astronaut',
    senderName: 'Tarek',
    senderNameAr: 'طارق',
    text: 'Good morning Mama! I saw Egypt from the window today and thought of you right away. Missing your tea and sending a huge hug ❤️',
    textAr: 'صباح الخير يا أمي! شوفت مصر من الشباك النهاردة وافتكرتك على طول. واحشني الشاي بتاعك وببعتلك حضن كبير ❤️',
    timestamp: 'Yesterday · 8:40 PM',
    status: 'Seen by Family Hub',
  },
  {
    id: 'msg-2',
    sender: 'family',
    senderName: 'Mama Amina',
    senderNameAr: 'ماما أمينة',
    text: 'May God keep you safe my son. We are all proud of you and waiting for Saturday video call 🤲🌹',
    textAr: 'ربنا يحفظك يا ابني ويرجعك بالسلامة. كلنا فخورين بيك ومستنيين مكالمة يوم السبت 🤲🌹',
    timestamp: 'Yesterday · 9:05 PM',
    status: 'Seen by Family Hub',
  },
];

export const QUICK_FRIENDLY_REPLIES = [
  {
    en: 'I love you, stay safe ❤️',
    ar: 'بحبك يا ابني، ربنا يحفظك ❤️',
  },
  {
    en: 'How are you feeling today?',
    ar: 'عامل إيه النهاردة يا طارق؟',
  },
  {
    en: 'Thinking of you and praying for you 🤲',
    ar: 'بندعيلك دايماً في كل وقت 🤲',
  },
  {
    en: 'Can’t wait for our Saturday call!',
    ar: 'مستنيين مكالمة يوم السبت بفارغ الصبر!',
  },
];

export const QUICK_EMOJIS = ['❤️', '🤲', '🌹', '😘', '😊', '🌙', '⭐', '🏠'];

export const DEMO_UPDATES: SimpleMissionUpdate[] = [
  {
    id: 'upd-1',
    date: 'Today · 2:10 PM',
    dateAr: 'اليوم · 2:10 ظهراً',
    title: 'Latest Approved Family Update',
    titleAr: 'آخر تحديث عائلي معتمد',
    summary:
      'Everything looks steady in the latest approved update. Tarek had a restful night, completed his daily workout, and had a warm meal with the crew.',
    summaryAr:
      'كل حاجة تمام في آخر تحديث معتمد. طارق ارتاح كويس بالليل، عمل تمارينه اليومية، واتغدى مع زمايله في المحطة.',
    kind: 'wellness',
    isNew: true,
  },
  {
    id: 'upd-2',
    date: 'This Saturday · 7:00 PM',
    dateAr: 'السبت الجاي · 7:00 مساءً',
    title: 'Upcoming Family Video Call',
    titleAr: 'موعد مكالمة الفيديو العائلية',
    summary:
      'A 20-minute private video call with Tarek is scheduled for Saturday evening. Just open the app and tap Video Call when it is time.',
    summaryAr:
      'في مكالمة فيديو خاصة لمدة 20 دقيقة مع طارق يوم السبت بالليل. افتحي التطبيق واضغطي على زرار مكالمة فيديو.',
    kind: 'call',
  },
  {
    id: 'upd-3',
    date: '3 Days Ago',
    dateAr: 'من 3 أيام',
    title: 'Six Weeks in Space Milestone',
    titleAr: 'مرور 6 أسابيع في الفضاء',
    summary:
      'Tarek and his team finished their sixth week aboard the station. He shared a twilight photo of the Nile River from above.',
    summaryAr:
      'طارق وفريقه كمّلوا 6 أسابيع في المحطة الفضائية، وبعت صورة جميلة لنهر النيل من فوق.',
    kind: 'milestone',
  },
];

export const DEMO_PHOTOS: FamilyPhoto[] = [
  {
    id: 'ph-1',
    title: 'Nile River from Above',
    titleAr: 'نهر النيل من الفضاء',
    caption: 'Photo shared by Tarek when passing over Egypt at sunset.',
    captionAr: 'صورة بعتها طارق وقت ما عدّوا فوق مصر عند الغروب.',
    imageUrl: '/src/assets/images/memory_box_orbital_1794656080166.jpg',
  },
  {
    id: 'ph-2',
    title: 'Family Letter & Keepsake',
    titleAr: 'جواب العيلة والتذكار',
    caption: 'The handwritten family blessing saved for Tarek’s trip.',
    captionAr: 'رسالة الدعاء والحب اللي كتبناها لطارق قبل السفر.',
    imageUrl: '/src/assets/images/memory_box_family_1794656080519.jpg',
  },
];

export const DEMO_PREFS: NotificationPrefs = {
  messageSounds: true,
  missionAlerts: true,
};
