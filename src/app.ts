import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import { connection } from 'mongoose';
import path from 'path';
import handlebars from 'express-handlebars';
import passport from 'passport';
import methodOverride from 'method-override';
import { formatDate } from './helpers/date';
import * as db from './config/db';
import * as pass from './config/passport';
import index from './routes';
import auth from './routes/auth';
import notes from './routes/notes';

// Load env configuration variables
dotenv.config();

// Connect to the database
db.connect();

// Init passport third party auth
pass.init();

// Start express
const app = express();

// Managing session with Mongo and mongoose
const mongoStoreFactory = connectMongo(session);
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new mongoStoreFactory({ mongooseConnection: connection }),
  })
);

// Set passport for auth management
app.use(passport.initialize());
app.use(passport.session());

// Set template engine: Handlebars
app.engine(
  '.hbs',
  handlebars({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: { formatDate },
  })
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, './views/')); // FIXME Set primary directory?

// Our bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Send PUT and DELETE requests from our templates. Tipically, browsers can't send PUT nor DELETE requests,
// but this package makes it possible to do so.
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/notes', notes);

// App port
const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
