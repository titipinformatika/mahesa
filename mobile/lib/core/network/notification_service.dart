import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/foundation.dart';

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  late GoRouter _router;
  FirebaseMessaging? _fcm;
  final _localNotif = FlutterLocalNotificationsPlugin();

  Future<void> init(GoRouter router) async {
    _router = router;

    try {
      _fcm = FirebaseMessaging.instance;
      // Request permission
      await _fcm!.requestPermission();

      // Foreground messages
      FirebaseMessaging.onMessage.listen(_onForegroundMessage);

      // Background tap
      FirebaseMessaging.onMessageOpenedApp.listen(_onMessageTap);

      // Cold start tap
      final initial = await _fcm!.getInitialMessage();
      if (initial != null) _onMessageTap(initial);
    } catch (e) {
      debugPrint('Firebase Messaging disabled: $e');
    }

    // Setup local notifications for foreground
    const androidInit = AndroidInitializationSettings('@mipmap/ic_launcher');
    const initSettings = InitializationSettings(android: androidInit);
    await _localNotif.initialize(
      initSettings,
      onDidReceiveNotificationResponse: (details) {
        if (details.payload != null) {
          // In a real app, parse JSON payload
        }
      },
    );
  }

  Future<String?> getToken() async {
    try {
      return await _fcm?.getToken();
    } catch (_) {
      return null;
    }
  }

  void _onForegroundMessage(RemoteMessage msg) {
    debugPrint('Foreground Message: ${msg.notification?.title}');
    _localNotif.show(
      msg.hashCode,
      msg.notification?.title ?? '',
      msg.notification?.body ?? '',
      const NotificationDetails(
        android: AndroidNotificationDetails(
          'mahesa_channel',
          'MAHESA Notifikasi',
          importance: Importance.high,
          priority: Priority.high,
        ),
      ),
    );
  }

  void _onMessageTap(RemoteMessage msg) {
    handleNotificationPayload(msg.data);
  }

  void handleNotificationPayload(Map<String, dynamic> data) {
    final String? type = data['type'];
    final String? id = data['id'];

    if (type == 'pengumuman' && id != null) {
      _router.push('/pengumuman/$id');
    } else if (type == 'absensi_reminder') {
      _router.push('/clock-in-out', extra: data['jenis_titik'] ?? 'jam_masuk');
    } else if (type == 'cuti_approval' || type == 'cuti_update') {
      // In a real app, navigate to cuti list or detail
    }
  }
}
