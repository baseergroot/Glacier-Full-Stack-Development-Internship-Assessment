import connectDB from "../src/database/connection.js";
import User from "../src/database/models/User.js";

await connectDB()
try {
  await User.register({ name: 'Groot', username: 'bsnm' }, '1122');
//   await User.register({ username: 'starbuck' }, 'redeye');
  console.log('Users registered successfully');
} catch (error) {
  console.error('Registration error:', error);
}
