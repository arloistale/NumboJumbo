/**
 * Created by jonathanlu on 6/11/16.
 */

var NJ = NJ || {};

NJ.audio = (function() {
    var _musicRes = null;
    var _musicId = -1;

    var shouldUseJSB = false;

    return {
        // preload an audio resource then callback
        // Callback usage: callback(isSuccess)
        preload: function(res, callback) {
            if(cc.sys.isNative && shouldUseJSB) {
                jsb.AudioEngine.preload(res, callback);
            } else {
                callback(true);
            }
        },

        // plays looping audio
        // stops old audio before playing new audio resource
        // first checks whether music is allowed by settings
        // does nothing if the same audio resource is specified
        playMusic: function(res) {
            if(!NJ.settings.music || res == _musicRes)
                return;

            if(_musicId >= 0) {
                if(cc.sys.isNative && shouldUseJSB)
                    jsb.AudioEngine.stop(_musicId);
                else
                    cc.audioEngine.stopMusic();
            }

            _musicRes = res;
            if(cc.sys.isNative && shouldUseJSB)
                _musicId = jsb.AudioEngine.play2d(res, true, NJ.MUSIC_VOLUME);
            else {
                cc.audioEngine.setMusicVolume(NJ.MUSIC_VOLUME);
                _musicId = 42;
                cc.audioEngine.playMusic(res, true);
            }
        },

        playSound: function(res) {
            if(!NJ.settings.sounds)
                return;

            if(cc.sys.isNative && shouldUseJSB)
                jsb.AudioEngine.play2d(res, false, NJ.SOUNDS_VOLUME);
            else {
                cc.audioEngine.setEffectsVolume(NJ.SOUNDS_VOLUME);
                cc.audioEngine.playEffect(res, false);
            }
        },

        stopMusic: function() {
            if(cc.sys.isNative && shouldUseJSB)
                jsb.AudioEngine.stop(_musicId);
            else
                cc.audioEngine.stopMusic();

            _musicRes = null;
            _musicId = -1;
        }
    }
}());