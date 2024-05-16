

const net = require('net');

// Initialize an array to store connected peers
let connectedPeers = [];

/// Create a TCP server to listen for incoming connections
const server = net.createServer(socket => {
  // Handle incoming connection
  console.log('Incoming connection from:', socket.remoteAddress);

  // Listen for data received from the peer
  socket.on('data', data => {
      // Process incoming data from the peer
      console.log('Data received from peer:', data.toString());
  });

  // Handle peer disconnection
  socket.on('end', () => {
      // Remove the peer's username from the list of connected peers
      connectedPeers = connectedPeers.filter(peer => peer.username !== socket.username);
      console.log('Peer disconnected:', socket.username);

      // Broadcast the updated list of connected peers to all existing peers
      broadcastPeers();
  });
});


// Function to broadcast the updated list of connected peers to all existing peers
function broadcastPeers() {
    server.getConnections((err, count) => {
        if (!err) {
            console.log('Number of connections:', count);

            // Get the list of active sockets using the server's 'connections' property
            server.getConnections((err, sockets) => {
                if (!err) {
                    //console.log('Type of sockets:', typeof sockets); // Log the type of sockets

                    // Convert sockets to an array if it's not already
                    if (!Array.isArray(sockets)) {
                        sockets = [sockets];
                    }

                    // Write the connected peers to all sockets
                    sockets.forEach(socket => {
                        if (socket.writable) {
                            socket.write(JSON.stringify(connectedPeers) + '\n');
                        } else {
                            //console.error('Socket not writable');
                            // If the socket is not writable, handle it accordingly
                            // For example, you might want to close the socket or take other appropriate actions.
                        }
                    });
                } else {
                    console.error('Error getting connections:', err);
                }
            });
        } else {
            console.error('Error getting connections:', err);
        }
    });
}


// Start the server and listen on a specific port
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Peer Server waiting for peers to connect  on  http://localhost:${PORT}`);
});