var Event = require('../models/EventModel.js');
var EventModel=Event.EventModel
var Search=Event.searchEngine;
var Category = require('../models/categoryModel');
var UserModel = require('../models/UserModel.js');
/**
 * EventController.js
 *
 * @description :: Server-side logic for managing Events.
 */
module.exports = {

    /**
     * EventController.list() for API
     */
    list: function (req, res) {
        EventModel.find(function (err, Events) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Event.',
                    error: err
                });
            }
            return res.json(Events);
        });
    },
    listAllEvents: function (req, res){
        //TODO get all categories this function as callback
        Category.find(function (err, Categories) {
            /*err*/
            EventModel.find(function(err, Events){
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting Event.',
                        error: err
                    });
                }

                return res.render('events/list', {events: Events, categories: Categories});
            });
        })

    },
    /**
     * EventController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        EventModel.findOne({_id: id}, function (err, Event) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Event.',
                    error: err
                });
            }
            if (!Event) {
                return res.status(404).json({
                    message: 'No such Event'
                });
            }
            return res.json(Event);
        });
    },
/** get from searchEngine
 * */
    searchEngine: function (req, res) {
        var input = req.body.query;

        console.log(req.body)

    //Search(input)

    EventModel.findOne({_id: id}, function (err, Event) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Event.',
                    error: err
                });
            }
            if (!Event) {
                return res.status(404).json({
                    message: 'No such Event'
                });
            }
            return res.json(Event);
        });
    },



    /**
     * EventController.showDetails()
     */
    showDetails : function (req, res){
        var uid = req.params.uid;
        var userId = req.query.rel;

        EventModel.findOne({uid: uid}, function (err, Event) {
          if (err) {
              return res.status(500).json({
                message: 'Error when getting Event.',
                error: err
          });
        }
        if (!Event) {
          return res.redirect('/events');
        }
        UserModel.findOne({_id: Event.publisher}, function(err, publisher){
          if (err) {
            console.error(err);
          }

          if (typeof userId === 'undefined' || userId === null || userId === "") {
            return res.render("events/detail", {
                name: Event.name,
                s_date : Event.s_date,
                end_date : Event.end_date,
                place_map : Event.place_map,
                adress : Event.adress,
                wilaya : Event.wilaya,
                needs : Event.needs,
                eventDescription : Event.eventDescription,
                publisher: publisher,
                needs: Event.needs,
                participent: Event.participent,
                user: req.user,
            });
          }

          UserModel.findOne({_id: userId}, function(err, User){
            if (err || !User) {
              return res.redirect('/events/'+Event.uid);
            }
            User.reputation += 0.1;
            User.save(function(err, User){
              if (err) {
                  return res.status(500).json({
                    message: 'Error when getting Event.',
                    error: err
                });
              }
              res.render("events/detail", {
                  name: Event.name,
                  s_date : Event.s_date,
                  end_date : Event.end_date,
                  place_map : Event.place_map,
                  adress : Event.adress,
                  wilaya : Event.wilaya,
                  needs : Event.needs,
                  eventDescription : Event.eventDescription,
                  publisher: publisher,
                  needs: Event.needs,
                  participent: Event.participent,
                  user: req.user,
              });
            });
          });
        });
         //
        });
    },
    getCreatePage: function(req, res){
      return res.render('events/create')
    },

    /**
     * EventController.create()
     */
    create: function (req, res) {
        console.log(req.body)
        var Event = new EventModel({
          name : req.body.name,
			s_date : req.body.s_date,
			end_date : req.body.end_date,
			place_map : req.body.place_map,
			adress : req.body.adress,
			wilaya : req.body.wilaya,
			needs : req.body.needs,
			participent : req.body.participent,
			pendingParticipents : req.body.pendingParticipents
        });
        Event.publisher = req.user;

        Event.save(function (err, Event) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Event',
                    error: err
                });
            }
            return res.redirect('/events');
        });
    },

    /**
     * EventController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        EventModel.findOne({_id: id}, function (err, Event) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Event',
                    error: err
                });
            }
            if (!Event) {
                return res.status(404).json({
                    message: 'No such Event'
                });
            }

            Event.s_date = req.body.s_date ? req.body.s_date : Event.s_date;
			Event.end_date = req.body.end_date ? req.body.end_date : Event.end_date;
			Event.place_map = req.body.place_map ? req.body.place_map : Event.place_map;
			Event.adress = req.body.adress ? req.body.adress : Event.adress;
			Event.wilaya = req.body.wilaya ? req.body.wilaya : Event.wilaya;
			Event.needs = req.body.needs ? req.body.needs : Event.needs;
			Event.participent = req.body.participent ? req.body.participent : Event.participent;
			Event.pendingParticipents = req.body.pendingParticipents ? req.body.pendingParticipents : Event.pendingParticipents;
            Event.save(function (err, Event) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Event.',
                        error: err
                    });
                }

                return res.json(Event);
            });
        });
    },

    /**
     * EventController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        EventModel.findByIdAndRemove(id, function (err, Event) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Event.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },
    /**
      * API controllers
      */
    getLatestEvents: function(req, res) {
      EventModel.find({end_date: {"$lt": Date.now()}}, function(err, Events){
        if (err) {
            return res.status(500).json({
                message: 'Error when deleting the Event.',
                error: err
            });
        }
        var events = Events.slice(0, 9);
        return res.json(events);
      });
    },

    getEvent: function(req, res) {
        var uid = req.params.uid;
        EventModel.findOne({uid : uid}, function(err, Event){
        if (err) {
            return res.status(500).json({
                message: 'Error when deleting the Event.',
                error: err
            });
        }
        return res.json(Event);
      })
    }, 

    getMarkers: function  (req, res) {
        res.json({
            "locations":[
                {
                    "place_name": "Sylabs",
                    "type": "Talent Accelerator",
                    "coord": {
                        "lat": 36.774423,
                        "lon": 3.060445
                    },
                    "is_premium":{type:Boolean, value:true}
                },
                {
                    "place_name": "WeltInfo",
                    "type": "Store",
                    "coord": {
                        "lat": 36.774285,
                        "lon": 3.059576
                    },
                    "is_premium":{type:Boolean, value:false}
                },
                {
                    "place_name": "Mahieddin Bachtarzi",
                    "type": "Teatre",
                    "coord": {
                        "lat": 36.781205, 
                        "lon": 3.060125
                    },
                    "is_premium":{type:Boolean, value:false}
                },
                {
                    "place_name": "Ketchaoua",
                    "type": "Mosque",
                    "coord": {
                        "lat": 36.784905, 
                        "lon": 3.060895
                    },
                    "is_premium":{type:Boolean, value:false}
                },
                {
            "place_name": "Beni Messous",
            "type": "Millitary zone ",
            "coord": {
                "lat": 36.773841,
                "lon": 2.989938
            },
                    "is_premium":{type:Boolean, value:false}
        } 

            ]
        })
            }
};
