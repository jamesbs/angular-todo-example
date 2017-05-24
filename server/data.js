const sqlite3 = require('sqlite3').verbose();

const todo = db => {
  return {
    add: task => {
      db.serialize(() => {
        const stmt = db.prepare('insert into todo values (?)');
        stmt.run(task);
      })
    },

    get: taskId => {
      return new Promise((resolve, reject) => {
        db.serialize(() => {
          db.get(
            'select rowid as id, task from todo where rowid = ?',
            taskId,
            (err, res) => {
              if(err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
        });
      });
    },

    list: () => {
      return new Promise((resolve, reject) => {
        db.serialize(() => {
          db.all('select rowid as id, task from todo', (err, res) => {
            if(err) {
              reject(err);
            } else {
              resolve(res);
            }
          });
        });
      });
    }
  }
};

const create = () => {
  const db = new sqlite3.Database(':memory:');

  db.serialize(() => {
    db.run(`create table todo (task text not null)`)
  });

  return {
    db,
    todo: todo(db),
  };
};


module.exports = {
  create
};
