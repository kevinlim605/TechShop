import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    // we use bcrypt.hashSync to pass in plain text password string as first argument, then
    // the number of rounds as the second arugment. The higher the rounds, the more secure
    // 10 is the default.
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Jane doe',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

export default users;
