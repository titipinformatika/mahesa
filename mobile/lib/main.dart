import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:firebase_core/firebase_core.dart';
import 'core/routing/app_router.dart';
import 'core/network/notification_service.dart';
import 'core/cache/cache_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await Firebase.initializeApp();
  } catch (e) {
    debugPrint('Firebase Init Skipped: $e');
  }
  await Hive.initFlutter();
  
  final cacheService = CacheService();
  await cacheService.init();

  runApp(
    const ProviderScope(
      child: MahesaApp(),
    ),
  );
}

class MahesaApp extends StatefulWidget {
  const MahesaApp({super.key});

  @override
  State<MahesaApp> createState() => _MahesaAppState();
}

class _MahesaAppState extends State<MahesaApp> {
  @override
  void initState() {
    super.initState();
    NotificationService().init(appRouter);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'MAHESA Mobile',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      routerConfig: appRouter,
    );
  }
}
