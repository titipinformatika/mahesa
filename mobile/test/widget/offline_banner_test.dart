import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mahesa_mobile/features/home/presentation/widgets/offline_banner.dart';
import 'package:mahesa_mobile/core/network/connectivity_service.dart';

void main() {
  testWidgets('OfflineBanner shows when offline', (WidgetTester tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          isOnlineProvider.overrideWithValue(false),
        ],
        child: const MaterialApp(
          home: Scaffold(
            body: OfflineBanner(),
          ),
        ),
      ),
    );

    expect(find.text('Mode Offline - Menampilkan data cache'), findsOneWidget);
    expect(find.byIcon(Icons.wifi_off), findsOneWidget);
  });

  testWidgets('OfflineBanner hidden when online', (WidgetTester tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          isOnlineProvider.overrideWithValue(true),
        ],
        child: const MaterialApp(
          home: Scaffold(
            body: OfflineBanner(),
          ),
        ),
      ),
    );

    expect(find.text('Mode Offline - Menampilkan data cache'), findsNothing);
  });
}
