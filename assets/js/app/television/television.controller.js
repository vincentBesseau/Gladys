/** 
  * Gladys Project
  * http://gladysproject.com
  * Software under licence Creative Commons 3.0 France 
  * http://creativecommons.org/licenses/by-nc-sa/3.0/fr/
  * You may not use this software for commercial purposes.
  * @author :: Pierre-Gilles Leymarie
  */

(function () {
    'use strict';

    angular
        .module('gladys')
        .controller('TelevisionCtrl', TelevisionCtrl);

    TelevisionCtrl.$inject = ['televisionService', 'deviceService', 'roomService', 'boxService'];

    function TelevisionCtrl(televisionService, deviceService, roomService, boxService) {
        /* jshint validthis: true */
        var vm = this;
        vm.roomId = null;
        vm.displayAskRoomForm = false;
        vm.currentPowerState = '';
        vm.currentSoundState = '';
        vm.currentChannel = '';
        vm.currentMuteState = '';
        vm.allSources = [{ label: 'TV' }];
        vm.currentSource = 'TV';
        vm.currentRoomName = '';

        vm.selectRoom = selectRoom;

        vm.play = play;
        vm.pause = pause;
        vm.stop = stop;
        vm.rewind = rewind;
        vm.fastForward = fastForward;
        vm.switchState = switchState;
        vm.getState = getState;
        vm.programPlus = programPlus;
        vm.programMinus = programMinus;
        vm.setChannel = setChannel;
        vm.setMuted = setMuted;
        vm.volumeUp = volumeUp;
        vm.volumeDown = volumeDown;
        vm.pressKey = pressKey;
        vm.getSources = getSources;
        vm.openSources = openSources;
        vm.openMenu = openMenu;
        vm.rec = rec;

        vm.thisChannel = null;

        vm.init = init;


        function init(id) {
            vm.boxId = id;
            boxService.getById(id)
                .then(function (data) {
                    vm.box = data.data;
                    if (vm.box.params && vm.box.params.room) {
                        vm.displayAskRoomForm = false;
                        vm.roomId = vm.box.params.roomId;
                        return getData(vm.roomId);
                    } else {
                        vm.displayAskRoomForm = true;
                    }
                });
            getRooms();
            getSources();
        }

        function getRooms() {
            roomService.get()
                .then(function (data) {
                    vm.rooms = data.data;
                });
        }

        function selectRoom(room) {
            boxService.update(vm.boxId, { params: { roomId: room.id } });
            vm.displayAskRoomForm = false;
            vm.roomId = room.id;
            vm.currentRoomName = room.name;
            getData(vm.roomId);
        }

        function getData(roomId) {
            deviceService.getDeviceTypeInRoom(roomId)
                .then(function (devicesTypes) {
                    devicesTypes = devicesTypes.data.deviceTypes;
                    for (var i = 0; i < devicesTypes.length; i++) {
                        if (devicesTypes[i].category === "tv") {
                            if (devicesTypes[i].deviceTypeIdentifier === 'Power') {
                                vm.currentPowerState = devicesTypes[i].lastValue
                                vm.devicePowerId = devicesTypes[i].id
                            }
                            if (devicesTypes[i].deviceTypeIdentifier === 'Sound') {
                                vm.currentSoundState = devicesTypes[i].lastValue
                                vm.deviceSoundId = devicesTypes[i].id
                            }
                            if (devicesTypes[i].deviceTypeIdentifier === 'Channel') {
                                vm.currentChannel = devicesTypes[i].lastValue
                                vm.thisChannel = devicesTypes[i].lastValue
                                vm.deviceChannelId = devicesTypes[i].id
                            }
                            if (devicesTypes[i].deviceTypeIdentifier === 'Mute') {
                                vm.currentMuteState = devicesTypes[i].lastValue
                                vm.deviceMuteId = devicesTypes[i].id
                            }
                        }
                    }
                })
        }

        function pressKey(key) {
            return televisionService.pressKey({ room: vm.roomId, key: key })
                .then(function () {

                });
        }

        function getSources() {
            return televisionService.getSources({ room: vm.roomId })
                .then(function (data) {
                    if (data.data !== undefined || data.data != 0) {
                        vm.allSources = data.data;
                    }
                })
        }

        function openSources(source) {
            return televisionService.openSources({ room: vm.roomId, id: source })
                .then(function (data) {
                    vm.currentSource = source;
                })
        }

        function openMenu() {
            return televisionService.openMenu({ room: vm.roomId })
                .then(function (data) {

                })
        }

        function rec() {
            return televisionService.rec({ room: vm.roomId })
                .then(function (data) {

                })
        }

        function play() {
            return televisionService.play({ room: vm.roomId, controlType: 'play' })
                .then(function () {

                });
        }

        function pause() {
            return televisionService.pause({ room: vm.roomId, controlType: 'pause' })
                .then(function () {

                });
        }

        function stop() {
            return televisionService.stop({ room: vm.roomId, controlType: 'stop' })
                .then(function () {

                });
        }

        function rewind() {
            return televisionService.rewind({ room: vm.roomId, controlType: 'rewind' })
                .then(function () {

                });
        }

        function fastForward() {
            return televisionService.fastForward({ room: vm.roomId, controlType: 'fastForward' })
                .then(function () {

                });
        }

        function switchState() {
            return televisionService.switchState({ room: vm.roomId, state: !vm.currentPowerState, deviceTypeId: vm.devicePowerId })
                .then(function (data) {
                    if (data.status === 200) {
                        vm.currentPowerState = !vm.currentPowerState
                    }
                });
        }

        function getState() {
            return televisionService.getState({ room: vm.roomId })
                .then(function (data) {

                });
        }

        function programPlus() {
            if (!vm.currentChannel) {
                vm.currentChannel = 0;
            }
            vm.thisChannel = parseInt(vm.currentChannel) + parseInt(1)
            setChannel(vm.thisChannel)
        }

        function programMinus() {
            if (!vm.currentChannel) {
                vm.currentChannel = 0;
            }
            if (vm.thisChannel > 0) {
                vm.thisChannel = parseInt(vm.currentChannel) - parseInt(1)
                setChannel(vm.thisChannel)
            }
        }

        function setChannel(channel) {
            return televisionService.setChannel({ room: vm.roomId, channel: channel, deviceTypeId: vm.deviceChannelId })
                .then(function (data) {
                    if (data.status === 200) {
                        vm.currentChannel = channel
                    }
                });
        }

        function volumeDown() {
            return televisionService.volumeDown({ room: vm.roomId, deviceTypeId: vm.deviceSoundId })
                .then(function (data) {
                    if (data.status === 200) {
                        vm.currentSoundState = parseInt(vm.currentSoundState) - parseInt(1)
                    }
                });
        }

        function volumeUp() {
            return televisionService.volumeUp({ room: vm.roomId, deviceTypeId: vm.deviceSoundId })
                .then(function (data) {
                    if (data.status === 200) {
                        vm.currentSoundState = parseInt(vm.currentSoundState) + parseInt(1)
                    }
                });
        }

        function setMuted() {
            return televisionService.setMuted({ room: vm.roomId, state: !vm.currentMuteState, deviceTypeId: vm.deviceMuteId })
                .then(function (data) {
                    if (data.status === 200) {
                        vm.currentMuteState = !vm.currentMuteState
                    }
                });
        }
    }
})();
