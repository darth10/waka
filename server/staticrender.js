const station = require('./station')
const line = require('./line')
const pug = require('pug')
const template = pug.compileFile('./dist/template.pug')

const defaultName = ' - Transit'

// TODO: Make this play perfectly with the router in the client side
const staticrender = {
  serve: function(req, res) {
    let title = 'DYMAJO Transit'
    let description = 'Your way around Auckland. Realtime, beautiful, and runs on all of your devices.'
    let canonical = 'https://transit.dymajo.com' + req.path

    const notFound = function() {
      res.status(404).send(template({
        title: 'Not Found - Transit',
        description: 'Sorry, but the page you were trying to view does not exist.'
      }))
    }
    const success = function() {
      res.send(template({
        title: title,
        description: description,
        canonical: canonical
      }))
    }

    let path = req.path.split('/')
    if (path[1] === '') {
      canonical = 'https://transit.dymajo.com'
      success()
    } else if (path[1] === 's') {
      if (path.length === 2) {
        return notFound()
      } else if (path.length === 3) {
        station._stopInfo(path[2], 'nz-akl').then(function(data) {
          title = data.stop_name + defaultName
          description = 'Realtime departures and timetable for '
          if (data.stop_name.toLowerCase().match('train station')|| 
            data.stop_name.toLowerCase().match('ferry terminal')) {
            description += data.stop_name
          } else {
            description += 'Bus Stop ' + path[2].trim()
          }
          description += ', Auckland.'

          success()
        }).catch(notFound)
      } else if (path.length === 5) {
        if (path[3] === 'timetable') {
          title = path[4].split('-')[0] + ' Timetable' + defaultName
          description = 'View timetable in DYMAJO Transit.'
          success()
        } else if (path[3] === 'realtime') {
          title = 'Realtime Trip Info' + defaultName
          description = 'View live vehicle location in DYMAJO Transit.'
          success()
        } else {
          return notFound()  
        }
      } else {
        return notFound()
      }
    } else if (path[1] === 'l') {
      if (path.length === 2) {
        title = 'Lines' + defaultName
        description = 'View all Auckland Bus, Train, and Ferry Services.'
        success()
      } else if (path.length === 3) {
        path[2] = path[2].trim()
        line._getLine(path[2], function(err, data) {
          if (data.length === 0) {
            return notFound()
          } else {
            title = `${data[0].route_short_name} - ${line._friendlyNames[path[2]] || data[0].route_long_name}${defaultName}`
            description = `View route information and timetables for ${line._friendlyNames[path[2]]||path[2]} services.`
            success()
          }
        })
      } else {
        return notFound()
      }
    } else if (path[1] === 'settings' && path.length === 2){
      return success()
    } else {
      return notFound()
    }
  }
}
module.exports = staticrender