export const motivationalMessages = {
  studying: ['🎯 Stay focused! You\'re in the zone.', '💪 Every minute counts. Keep going!', '🧠 Your future self will thank you.', '⚡ You\'ve got this! Focus time!', '🔥 Let\'s crush this study session!'],
  breaking: ['😌 You deserve this break. Relax!', '☕ Time to refresh your mind.', '🎉 Great work! Enjoy your break!'],
  longBreak: ['🎊 Amazing! You\'ve completed 4 sessions!', '👑 You\'re a study champion!', '🏆 Long break earned! You\'re crushing it!'],
};

export const getRandomMessage = (category: 'studying' | 'breaking' | 'longBreak'): string => {
  const messages = motivationalMessages[category];
  return messages[Math.floor(Math.random() * messages.length)];
};