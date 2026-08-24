const { Server } = require('socket.io');

let io;
const stationViewers = new Map();

const viewerCount = (stationId) => stationViewers.get(stationId)?.size || 0;

const emitPresence = (stationId) => {
  if (!io) return;
  const payload = { stationId, count: viewerCount(stationId) };
  // Passenger sockets are in the station room; admin sockets may watch a presence room.
  io.to(stationId).emit('presenceUpdate', payload);
  io.to(`presence:${stationId}`).emit('presenceUpdate', payload);
};

const removeViewer = (stationId, socketId) => {
  if (!stationId) return;
  const set = stationViewers.get(stationId);
  if (!set) return;
  set.delete(socketId);
  if (set.size === 0) stationViewers.delete(stationId);
  emitPresence(stationId);
};

const initSocket = (server) => {
  io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    let currentStation = null;
    let presenceStation = null;

    socket.on('joinStation', (stationId) => {
      if (!stationId) return;

      if (currentStation) {
        socket.leave(currentStation);
        removeViewer(currentStation, socket.id);
      }

      socket.join(stationId);
      currentStation = stationId;

      if (!stationViewers.has(stationId)) stationViewers.set(stationId, new Set());
      stationViewers.get(stationId).add(socket.id);
      emitPresence(stationId);
    });

    socket.on('watchPresence', (stationId) => {
      if (presenceStation) socket.leave(`presence:${presenceStation}`);
      if (!stationId) return;
      socket.join(`presence:${stationId}`);
      presenceStation = stationId;
      socket.emit('presenceUpdate', { stationId, count: viewerCount(stationId) });
    });

    socket.on('disconnect', () => {
      removeViewer(currentStation, socket.id);
    });
  });
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

module.exports = { initSocket, getIO };
