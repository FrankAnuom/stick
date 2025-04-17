// utils/index.js

// ✅ Generate or get existing device ID
export const getDeviceId = () => {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = crypto.randomUUID(); // Generates a unique ID
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  };
  
  // ✅ Fix bug in offset calculation
  export const setNewOffset = (card, mouseMoveDir = { x: 0, y: 0 }) => {
    const offsetLeft = card.offsetLeft - mouseMoveDir.x;
    const offsetTop = card.offsetTop - mouseMoveDir.y;
  
    return {
      x: offsetLeft < 0 ? 0 : offsetLeft,
      y: offsetTop < 0 ? 0 : offsetTop,
    };
  };
  
  // ✅ Safe parse of body value
  export const bodyParser = (value) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  };
  