# apt-get install -y x11vnc xvfb fluxbox

export DISPLAY=${DISPLAY:-:0} # Select screen 0 by default.
xdpyinfo
if which x11vnc &>/dev/null; then
  ! pgrep -a x11vnc && x11vnc -bg -forever -nopw -quiet -display WAIT$DISPLAY &
fi
! pgrep -a Xvfb && Xvfb $DISPLAY -screen 0 1024x768x16 &
sleep 1
if which fluxbox &>/dev/null; then
  ! pgrep -a fluxbox && fluxbox 2>/dev/null &
fi
echo "IP: $(hostname -I) ($(hostname))"


# export DISPLAY=:1
# Xvfb $DISPLAY -screen 0 1024x768x16 &
# fluxbox &
# x11vnc -display $DISPLAY -bg -forever -nopw -quiet -listen localhost -xkb

x11vnc -rfbport 26370 -create -env FD_PROG=/usr/bin/fluxbox -env X11VNC_FINDDISPLAY_ALWAYS_FAILS=1 -env X11VNC_CREATE_GEOM=${1:-1024x768x16} -gone 'killall Xvfb' -bg -nopw
# https://stackoverflow.com/questions/12050021/how-to-make-xvfb-display-visible
# x11vnc -display :99 -localhost & vncviewer :0

