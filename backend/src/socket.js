let io;

const setupSocket = (server) => {
  const socketIO = require('socket.io');
  io = new socketIO.Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.on('joinExpertRoom', (expertId) => {
      if (expertId) {
        socket.join(`expert_${expertId}`);
      }
    });

    socket.on('leaveExpertRoom', (expertId) => {
      if (expertId) {
        socket.leave(`expert_${expertId}`);
      }
    });
  });
};

const emitSlotUpdate = (expertId, payload) => {
  if (!io) return;
  io.to(`expert_${expertId}`).emit('slotBooked', payload);
};

module.exports = {
  setupSocket,
  emitSlotUpdate,
};
