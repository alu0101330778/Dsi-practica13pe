import express from 'express';
import { Course, Student } from '../schema/schemas.js';
export const userRouter = express.Router();


userRouter.post('/student', (req, res) => {
  const user = new Student(req.body);

  user.save().then((user) => {
    res.status(201).send(user);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

userRouter.get('/student', (req, res) => {
  let filter;
  if (req.query.id) {
  filter = req.query.id?{email: req.query.id.toString()}:{};
  } else {
    filter = {};
  }

  Student.find(filter).then((users) => {
    if (users.length !== 0) {
      res.send(users);
    } else {
      res.status(404).send();
    }
  }).catch((error) => {
    res.status(500).send(error);
  });
});

userRouter.delete('/student', (req, res) => {
  if (!req.query.email) {
    res.status(400).send({
      error: 'A username must be provided',
    });
  } else {
    Student.findOne({email: req.query.email}).then((user) => {
      if (!user) {
        res.status(404).send();
        return Promise.reject();
      } else {
          
            // Delete the user
            return Student.findByIdAndDelete(user._id).then((user) => {
              res.send(user);
            });
    
      }
    }).catch((error) => {
      res.status(500).send(error);
    });
  }
});

userRouter.patch('/student', (req, res) => {
  if (!req.query.email) {
    res.status(400).send({
      error: 'A username must be provided',
    });
  } else {
    const allowedUpdates = ['id', 'name', 'apellidos', 'edad', 'email', 'asignaturas'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      Student.findOneAndUpdate({email: req.query.email?.toString()}, req.body, {
        new: true,
        runValidators: true,
      }).then((user) => {
        if (!user) {
          res.status(404).send();
        } else {
          res.send(user);
        }
      }).catch((error) => {
        res.status(500).send(error);
      });
    }
  }
});

userRouter.post('/course', (req, res) => {
  const course = new Course(req.body);
  course.save().then((course) => {
    res.status(201).send(course);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

userRouter.get('/course', (req, res) => {
  let filter;
  if (req.query.id) {
  filter = req.query.id?{_id: req.query.id.toString()}:{};
  } else {
    filter = {};
  }

  Course.find(filter).then((users) => {
    if (users.length !== 0) {
      res.send(users);
    } else {
      res.status(404).send();
    }
  }).catch((error) => {
    res.status(500).send(error);
  });
});
userRouter.delete('/course', (req, res) => {
  if (!req.query.id) {
    res.status(400).send({
      error: 'A unique identifier',
    });
  } else {
    Student.findOne({email: req.query.email}).then((user) => {
      if (!user) {
        res.status(404).send();
        return Promise.reject();
      } else {
          
            // Delete the user
            return Student.findByIdAndDelete(user._id).then((user) => {
              res.send(user);
            });
    
      }
    }).catch((error) => {
      res.status(500).send(error);
    });
  }
});

/*userRouter.get('/student', (req, res) => {
  const filter = req.query.user?{name: req.query.user.toString()}:{};

  Student.find(filter).then((student) => {
    if (filter.length !== 0) {
      res.send(filter);
    } else {
      res.status(404).send();
    }
  }).catch((error) => {
    res.status(500).send(error);
  });
});*/
