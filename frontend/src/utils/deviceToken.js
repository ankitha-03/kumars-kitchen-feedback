/**
 * Generates and persists an anonymous device token in localStorage.
 * No personal data is stored — just a random string to track return visits.
 * Token looks like: anon_k7x9mq2p1_lf4z8
 */
export function getDeviceToken() {
  let token = localStorage.getItem('kkDeviceToken');
  if (!token) {
    token = 'anon_'
          + Math.random().toString(36).substr(2, 9)
          + '_'
          + Date.now().toString(36);
    localStorage.setItem('kkDeviceToken', token);
  }
  return token;
}
