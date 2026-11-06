// Rewards independently initialize from the Three.js scene, so 3D loading errors
// do not silently disable the Rewards button.
import {game} from './game.js';
import {initRewards} from './rewards.js';
const status = document.querySelector('#reward-description');
try {
  const rewards = initRewards(game);
  document.querySelector('#passport-rewards').addEventListener('click', () => rewards.open());
} catch (error) {
  console.error('Reward initialization failed:', error);
  const panel = document.querySelector('#rewards');
  const showError = () => {
    document.querySelectorAll('.panel').forEach(p => { p.hidden = true; });
    panel.hidden = false;
    status.textContent = '獎勵功能載入時發生問題，請重新整理網頁。若問題持續，請開啟瀏覽器開發者工具查看錯誤。';
  };
  document.querySelector('#btn-rewards').addEventListener('click', showError);
  document.querySelector('#passport-rewards').addEventListener('click', showError);
}
